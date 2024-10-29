import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { content } from '../models/contentSchema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Upload controller
const createContent = async (req, res) => {
  try {
    const { mediaTags, description, orientation } = req.body;
    const imagePaths = req.files.map((file) => file.path);

    const newContent = new content({
      mediaTags: mediaTags.split(','),
      description,
      orientation,
      images: imagePaths,
    });

    await newContent.save();
    res
      .status(201)
      .json({ message: 'Content created successfully', content: newContent });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// List controller
const listContent = async (req, res) => {
  try {
    const contents = await content.find();
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit controller
const editContent = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedContent = await content.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: 'Content updated successfully',
      content: updatedContent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete controller
const deleteContent = async (req, res) => {
  const { id } = req.params;
  try {
    const contentToDelete = await Content.findByIdAndDelete(id);
    if (contentToDelete) {
      // Optional: Delete files from the server
      contentToDelete.images.forEach((imagePath) => fs.unlinkSync(imagePath));
      res.status(200).json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { upload, createContent, listContent, editContent, deleteContent };
