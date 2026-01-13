import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createRouter } from './routes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: true, // Allow any origin for dev simplicity
  credentials: true,
}));

app.use(express.json());

app.use('/api/v1', createRouter());

app.listen(port, () => {
  console.log(`✅ TaskFlow API running on http://localhost:${port}`);
});
