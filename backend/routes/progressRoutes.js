import express from 'express';
import QuizResult from '../models/QuizResult.js';

const router = express.Router();

// Get progress stats
router.get('/progress', async (req, res) => {
  try {
    const quizResults = await QuizResult.find().sort({ takenAt: -1 });

    const totalQuizzes = quizResults.length;
    const averageScore = totalQuizzes > 0
      ? Math.round(quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes)
      : 0;

    const recentQuizzes = quizResults.slice(0, 10).map(quiz => ({
      pdfName: quiz.pdfName,
      score: quiz.score,
      date: quiz.takenAt.toLocaleDateString(),
    }));

    // Calculate topic performance (placeholder)
    const topicPerformance = [];

    // Calculate weak topics (scores below 60%)
    const weakTopics = quizResults
      .filter(quiz => quiz.score < 60)
      .map(quiz => ({
        name: quiz.pdfName,
        accuracy: quiz.score,
      }))
      .slice(0, 5);

    res.json({
      success: true,
      totalQuizzes,
      averageScore,
      totalStudyTime: 0, // Placeholder
      recentQuizzes,
      topicPerformance,
      scoreDistribution: [],
      weakTopics,
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch progress',
      message: error.message 
    });
  }
});

export default router;
