import { type ChildProcess, spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import consola from 'consola';

const CONFIG = {
  server: {
    url: process.env.SERVER_URL || 'http://localhost:3000',
    port: process.env.PORT || '3000',
    maxStartupTime: 60_000,
    healthCheckInterval: 1_000,
    shutdownTimeout: 10_000,
  },
  paths: {
    outputPath: join(process.cwd(), 'public', 'openapi.yaml'),
    apiEndpoint: '/api/openapi.yaml',
    healthEndpoint: '/api/health',
  },
  timeouts: {
    fetch: 10_000,
    healthCheck: 5_000,
  },
} as const;

interface ServerProcess {
  child: ChildProcess | null;
  isShuttingDown: boolean;
}

const createServerProcess = (): ServerProcess => ({
  child: null,
  isShuttingDown: false,
});

const startDevServer = async (server: ServerProcess): Promise<void> => {
  consola.info('🚀 Starting development server...');

  return new Promise((resolve, reject) => {
    server.child = spawn('pnpm', ['dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: false,
    });

    if (!server.child) {
      return reject(new Error('Failed to spawn server process'));
    }

    server.child.on('exit', (code) => {
      if (!server.isShuttingDown && code !== 0) {
        reject(new Error(`Server process exited with code ${code}`));
      }
    });

    server.child.on('error', (error) => {
      reject(new Error(`Server spawn error: ${error.message}`));
    });

    server.child.stdout?.on('data', (data) => {
      const output = data.toString();

      if (output.includes('Local:') && output.includes(CONFIG.server.port)) {
        consola.success('✅ Development server started');
        resolve();
      }
    });

    server.child.stderr?.on('data', (data) => {
      const output = data.toString();

      if (output.includes('Error:') || output.includes('EADDRINUSE')) {
        reject(new Error(`Server error: ${output.trim()}`));
      }
    });

    const timeout = setTimeout(() => {
      if (server.child && !server.child.killed) {
        reject(new Error(`Server startup timeout after ${CONFIG.server.maxStartupTime}ms`));
      }
    }, CONFIG.server.maxStartupTime);

    const originalResolve = resolve;
    const originalReject = reject;
    resolve = (...args) => {
      clearTimeout(timeout);
      originalResolve(...args);
    };
    reject = (...args) => {
      clearTimeout(timeout);
      originalReject(...args);
    };
  });
};

const waitForServerReady = async (): Promise<void> => {
  consola.info('⏳ Waiting for server to be ready...');

  const startTime = Date.now();
  const maxWaitTime = CONFIG.server.maxStartupTime;

  while (Date.now() - startTime < maxWaitTime) {
    if (await checkEndpoint(CONFIG.paths.apiEndpoint)) {
      consola.success('✅ Server is ready');
      return;
    }

    await sleep(CONFIG.server.healthCheckInterval);
  }

  throw new Error('Server readiness timeout');
};

const checkEndpoint = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${CONFIG.server.url}${endpoint}`, {
      signal: AbortSignal.timeout(CONFIG.timeouts.healthCheck),
    });
    return response.ok;
  } catch {
    return false;
  }
};

const stopDevServer = async (server: ServerProcess): Promise<void> => {
  if (!server.child) {
    return;
  }

  consola.info('🛑 Stopping development server...');
  server.isShuttingDown = true;

  return new Promise((resolve) => {
    if (!server.child) {
      return resolve();
    }

    server.child.once('exit', () => {
      consola.success('✅ Development server stopped');
      server.child = null;
      resolve();
    });

    server.child.kill('SIGTERM');

    setTimeout(() => {
      if (server.child && !server.child.killed) {
        consola.warn('⚠️  Force killing server process');
        server.child.kill('SIGKILL');
      }
    }, CONFIG.server.shutdownTimeout);
  });
};

const fetchOpenApiSpec = async (): Promise<void> => {
  consola.info('📥 Fetching OpenAPI specification...');

  try {
    const response = await fetch(`${CONFIG.server.url}${CONFIG.paths.apiEndpoint}`, {
      headers: { Accept: 'text/yaml, application/x-yaml' },
      signal: AbortSignal.timeout(CONFIG.timeouts.fetch),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const spec = await response.text();

    mkdirSync(dirname(CONFIG.paths.outputPath), { recursive: true });

    writeFileSync(CONFIG.paths.outputPath, spec, 'utf-8');

    consola.success(`💾 OpenAPI spec saved to ${CONFIG.paths.outputPath}`);
  } catch (error) {
    consola.error('Failed to fetch OpenAPI spec:', error);

    if (existsSync(CONFIG.paths.outputPath)) {
      consola.warn('⚠️  Using existing OpenAPI spec file');
      return;
    }

    throw new Error('No OpenAPI spec available and fetch failed');
  }
};

const generateTypeDefinitions = async (): Promise<void> => {
  consola.info('🔧 Generating type definitions...');

  return new Promise((resolve, reject) => {
    const child = spawn('pnpm', ['run', 'generate-types:ci'], {
      stdio: 'inherit',
    });

    child.on('exit', (code) => {
      if (code === 0) {
        consola.success('✅ Type definitions generated successfully');
        resolve();
      } else {
        reject(new Error(`Type generation failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Type generation spawn error: ${error.message}`));
    });
  });
};

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const runTypeGeneration = async (): Promise<void> => {
  const server = createServerProcess();
  let serverStarted = false;

  try {
    consola.start('🎯 Starting automated type generation workflow...');

    // Step 1: Start development server
    await startDevServer(server);
    serverStarted = true;

    // Step 2: Wait for server to be ready
    await waitForServerReady();

    // Step 3: Fetch OpenAPI specification
    await fetchOpenApiSpec();

    // Step 4: Stop development server
    await stopDevServer(server);
    serverStarted = false;

    // Step 5: Generate type definitions
    await generateTypeDefinitions();

    consola.success('🎉 Type generation workflow completed successfully!');
  } catch (error) {
    consola.error('❌ Workflow failed:', error);

    // Cleanup: stop server if it's running
    if (serverStarted && server.child) {
      try {
        await stopDevServer(server);
      } catch (cleanupError) {
        consola.error('Failed to cleanup server:', cleanupError);
      }
    }

    process.exit(1);
  }
};

const setupSignalHandlers = (): void => {
  const handleExit = (signal: string) => {
    consola.info(`Received ${signal}, exiting gracefully...`);
    process.exit(0);
  };

  process.on('SIGINT', () => handleExit('SIGINT'));
  process.on('SIGTERM', () => handleExit('SIGTERM'));
};

const main = async (): Promise<void> => {
  setupSignalHandlers();

  try {
    await runTypeGeneration();
  } catch (error) {
    consola.error('Unexpected error:', error);
    process.exit(1);
  }
};

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
