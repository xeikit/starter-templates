/** @type {import('prettier').Config} */
const config = {
  tabWidth: 2,
  printWidth: 120,
  trailingComma: 'all',
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
