import { createFileRoute } from '@tanstack/react-router';
import { Index } from '@/components/index/Index';

const Home = () => {
  return <Index />;
};

export const Route = createFileRoute('/')({
  component: Home,
});
