import express from 'express';
import { chatWithPDF } from '../services/chatService.js';

const router = express.Router();

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, pdfId } = req.body;

    if (!message || !pdfId) {
      return res.status(400).json({ error: 'Message and pdfId are required' });
    }

    const response = await chatWithPDF(message, pdfId);

    res.json({
      success: true,
      response: response.answer,
      citations: response.citations || [],
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat', 
      message: error.message 
    });
  }
});

export default router;
