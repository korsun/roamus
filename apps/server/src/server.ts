import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { routing } from '@/routes/routing';
import { errorHandler } from '@/middleware/errorMiddleware';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['https://roamus-client.vercel.app', /\.vercel\.app$/i],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.options('*', cors());
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
