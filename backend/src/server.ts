import app from './app';
import { env } from './config/env';

const startServer = () => {
  const port = env.PORT;

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
  });
};

startServer();
