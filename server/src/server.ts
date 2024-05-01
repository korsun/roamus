import express from 'express';
import cors from 'cors';

import { routing } from '@/routes/routing';
import { errorHandler } from '@/middleware/errorMiddleware';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routing);

app.get('/', (_, res) => {
  res.send('API is running....');
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(`${'\u001b[1;34m'}Server listening on port ${PORT} 🚀🚀🚀`),
);
