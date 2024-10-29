import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { dbconnection } from './database/dbconnections.js';
import { config } from 'dotenv';

import { contentRouter } from './routes/contentRouter.js';

config();

export const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow credentials
  })
);

app.use('/api/v1/content', contentRouter);

dbconnection();
