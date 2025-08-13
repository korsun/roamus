import http from 'http';

import { app } from './app';

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
server.setTimeout(30_000);
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;

let isShuttingDown = false;
const shutdown = (reason: string) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.error(`Shutting down: ${reason}`);

  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`${'\u001b[1;34m'}Server listening on port ${PORT} 🚀🚀🚀`),
);
