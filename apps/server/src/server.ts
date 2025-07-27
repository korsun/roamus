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

// Mount the router at the root path since Vercel is already handling the /api prefix
app.use('/', routing);

app.get('/', (_, res) => {
  res.send('API is running....');
});

app.get('/api/test', (_, res) => {
  res.json({ message: 'Test endpoint works!' });
});

app.use(errorHandler);

export default app;
