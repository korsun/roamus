import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { routing } from '@/routes/routing';
import { errorHandler } from '@/middleware/errorMiddleware';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
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
