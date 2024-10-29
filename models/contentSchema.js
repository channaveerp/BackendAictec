import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  mediaTags: [String],
  description: { type: String, required: true },
  orientation: {
    type: String,
    enum: ['Fit to screen', 'Original size'],
    default: 'Fit to screen',
  },
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

export const content = mongoose.model('content', contentSchema);
