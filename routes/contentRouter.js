import express from 'express';

import {
  createContent,
  deleteContent,
  editContent,
  listContent,
  upload,
} from '../controlers/contentController.js';
const router = express.Router();

// Routes
router.post('/', upload.array('images'), createContent); // Use 'images' as the key for file uploads
router.get('/list', listContent);
router.put('/:id', editContent);
router.delete('/:id', deleteContent);

export { router as contentRouter };
