import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  pdfId: {
    type: String,
    required: true,
  },
  pdfName: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  answers: {
    type: Map,
    of: String,
  },
  takenAt: {
    type: Date,
    default: Date.now,
  },
  weakTopics: [String],
});

export default mongoose.model('QuizResult', quizResultSchema);
