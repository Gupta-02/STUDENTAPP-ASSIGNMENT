import express from 'express';
import { generateQuiz } from '../services/quizService.js';
import QuizResult from '../models/QuizResult.js';

const router = express.Router();

// Generate quiz
router.post('/generate-quiz', async (req, res) => {
  try {
    const { pdfId, type = 'mixed' } = req.body;

    if (!pdfId) {
      return res.status(400).json({ error: 'pdfId is required' });
    }

    const questions = await generateQuiz(pdfId, type);

    res.json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate quiz', 
      message: error.message 
    });
  }
});

// Save quiz result
router.post('/save-quiz-result', async (req, res) => {
  try {
    const { pdfId, pdfName, score, totalQuestions, correctAnswers, answers } = req.body;

    const quizResult = new QuizResult({
      pdfId,
      pdfName: pdfName || 'Unknown PDF',
      score,
      totalQuestions,
      correctAnswers,
      answers,
    });

    await quizResult.save();

    res.json({
      success: true,
      message: 'Quiz result saved',
    });
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({ 
      error: 'Failed to save quiz result',
      message: error.message 
    });
  }
});

export default router;
