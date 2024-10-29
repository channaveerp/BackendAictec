import express from 'express';
import { createContent, upload } from '../controlers/contentController.js';

export const contentRouter = express.Router();
contentRouter.post('/', upload.array('images', 5), createContent);
// post('/', upload.array('images', 5), createContent)
