import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['preset', 'uploaded'],
    default: 'uploaded',
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  chunks: [{
    text: String,
    page: Number,
    embedding: [Number],
  }],
});

export default mongoose.model('PDF', pdfSchema);
