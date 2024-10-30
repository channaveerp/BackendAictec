import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { content } from '../models/contentSchema.js';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Filter for file types (allow images and videos)
const fileFilter = (req, file, cb) => {
  const imageTypes = /image\/(jpeg|jpg|png|gif)/; // Allowed image MIME types
  const videoTypes = /video\/(mp4|avi|mov)/; // Allowed video MIME types

  if (imageTypes.test(file.mimetype) || videoTypes.test(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image and video files are allowed!'), false); // Reject the file
  }
};

const upload = multer({ storage, fileFilter });

const createContent = async (req, res) => {
  try {
    const { mediaTags, description, orientation } = req.body;

    // Extract file paths and sizes from uploaded files
    const images = req.files.map((file) => ({
      path: `/uploads/${file.filename}`,
      size: file.size, // Size in bytes
    }));

    const newContent = new content({
      mediaTags: mediaTags.split(',').map((tag) => tag.trim()),
      description,
      orientation,
      images,
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

const editContent = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedContent = await content.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json({
      message: 'Content updated successfully',
      content: updatedContent,
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete controller
const deleteContent = async (req, res) => {
  const { id } = req.params;

  try {
    const contentToDelete = await content.findByIdAndDelete(id);

    if (contentToDelete) {
      if (Array.isArray(contentToDelete.media)) {
        // Delete files from the server
        contentToDelete.media.forEach((mediaPath) => {
          const fullPath = path.join(
            __dirname,
            '../uploads',
            path.basename(mediaPath)
          );
          fs.unlink(fullPath, (err) => {
            if (err) {
              console.error(`Error deleting file: ${fullPath}`, err);
            }
          });
        });
      }

      res.status(200).json({ message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ message: 'Content not found' });
    }
  } catch (error) {
    console.error('Error in deleteContent:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export { upload, createContent, listContent, editContent, deleteContent };
