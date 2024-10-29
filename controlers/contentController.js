import multer from 'multer'; // Use ES import
import { content } from '../models/contentSchema.js';

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File filter: Accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the image
  } else {
    cb(new Error('Only image files are allowed!'), false); // Reject non-image files
  }
};

// Initialize Multer to handle multiple image uploads (max 5 images)
const upload = multer({ storage, fileFilter }); // Don't call `.array()` here

// Controller to create new content
const createContent = async (req, res) => {
  console.log('API endpoint hit');
  try {
    debugger;
    const { mediaTags, description, orientation } = req.body;
    console.log(res.body);
    // Extract file paths from uploaded images
    const imagePaths = req.files.map((file) => file.path);

    // Create a new content entry
    const newContent = new content({
      mediaTags: mediaTags.split(','), // Convert tags to an array
      description,
      orientation,
      images: imagePaths, // Store file paths in DB
    });

    // Save the content in the database
    await newContent.save();

    res.status(201).json({
      message: 'Content created successfully',
      content: newContent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { upload, createContent }; // Use ES exports
