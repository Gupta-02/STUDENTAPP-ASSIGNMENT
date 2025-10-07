import mongoose from 'mongoose';

const chatHistorySchema = new mongoose.Schema({
  pdfId: {
    type: String,
    required: true,
  },
  messages: [{
    text: String,
    sender: {
      type: String,
      enum: ['user', 'bot'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    citations: [{
      page: Number,
      text: String,
    }],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ChatHistory', chatHistorySchema);
