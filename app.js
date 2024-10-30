import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

import { dbconnection } from './database/dbconnections.js';
import { config } from 'dotenv';

import { contentRouter } from './routes/contentRouter.js';
import { fileURLToPath } from 'url';

config();

export const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials
  })
);

app.use('/api/v1/content', contentRouter);

dbconnection();
