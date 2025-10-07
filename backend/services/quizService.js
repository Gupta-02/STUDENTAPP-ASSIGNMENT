import { ChatOpenAI } from '@langchain/openai';
import { searchPDF } from './pdfService.js';

/**
 * Generate quiz questions from PDF content
 */
export async function generateQuiz(pdfId, type = 'mixed') {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Return sample quiz if OpenAI is not configured
      return getSampleQuiz(type);
    }

    // Get relevant content from PDF
    const context = await getQuizContext(pdfId);

    // Create LLM instance
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.8,
    });

    // Generate quiz based on type
    let prompt = '';

    if (type === 'mcq' || type === 'mixed') {
      prompt = `Generate 5 multiple-choice questions (MCQs) from the following content. 
Each question should have 4 options (A, B, C, D) and one correct answer.
Also provide a brief explanation for each answer.

Content:
${context}

Format your response as a JSON array with this structure:
[
  {
    "type": "mcq",
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Explanation why this is correct"
  }
]

Generate the questions:`;
    } else if (type === 'saq') {
      prompt = `Generate 3 short answer questions (SAQs) from the following content.
Each question should require a 2-3 sentence answer.

Content:
${context}

Format your response as a JSON array with this structure:
[
  {
    "type": "saq",
    "question": "Question text here?",
    "sampleAnswer": "Sample answer here",
    "explanation": "Key points that should be covered"
  }
]

Generate the questions:`;
    }

    const response = await llm.invoke(prompt);
    
    // Parse the JSON response
    const jsonMatch = response.content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions;
    }

    // Fallback to sample quiz if parsing fails
    return getSampleQuiz(type);

  } catch (error) {
    console.error('Quiz generation error:', error);
    return getSampleQuiz(type);
  }
}

/**
 * Get context for quiz generation
 */
async function getQuizContext(pdfId) {
  try {
    // Get random content from PDF
    const docs = await searchPDF(pdfId, 'summary main concepts topics', 5);
    return docs.map(doc => doc.text).join('\n\n').substring(0, 3000);
  } catch (error) {
    console.error('Error getting quiz context:', error);
    return 'Sample educational content about science and learning.';
  }
}

/**
 * Sample quiz for when OpenAI is not configured
 */
function getSampleQuiz(type) {
  const mcqs = [
    {
      type: 'mcq',
      question: 'What is the primary purpose of studying?',
      options: [
        'To gain knowledge and understanding',
        'To pass exams only',
        'To memorize facts',
        'To compete with others'
      ],
      correctAnswer: 'To gain knowledge and understanding',
      explanation: 'The primary purpose of studying is to gain knowledge and understanding, which enables us to apply what we learn in practical situations.'
    },
    {
      type: 'mcq',
      question: 'Which learning technique is most effective for long-term retention?',
      options: [
        'Last-minute cramming',
        'Passive reading',
        'Active recall and spaced repetition',
        'Highlighting text'
      ],
      correctAnswer: 'Active recall and spaced repetition',
      explanation: 'Active recall and spaced repetition are scientifically proven to be the most effective techniques for long-term memory retention.'
    },
    {
      type: 'mcq',
      question: 'What does RAG stand for in AI context?',
      options: [
        'Random Answer Generation',
        'Retrieval-Augmented Generation',
        'Rapid AI Growth',
        'Reading and Generating'
      ],
      correctAnswer: 'Retrieval-Augmented Generation',
      explanation: 'RAG stands for Retrieval-Augmented Generation, a technique that retrieves relevant information before generating responses.'
    },
    {
      type: 'mcq',
      question: 'What is the benefit of taking practice quizzes?',
      options: [
        'It wastes time',
        'It identifies knowledge gaps and strengthens memory',
        'It is only for grades',
        'It creates stress'
      ],
      correctAnswer: 'It identifies knowledge gaps and strengthens memory',
      explanation: 'Practice quizzes help identify areas that need more study and strengthen memory through active recall.'
    },
    {
      type: 'mcq',
      question: 'What is the recommended study break interval?',
      options: [
        'No breaks needed',
        '25-30 minutes with 5-10 minute breaks',
        'Study for 3 hours straight',
        'Take breaks every 5 minutes'
      ],
      correctAnswer: '25-30 minutes with 5-10 minute breaks',
      explanation: 'The Pomodoro Technique suggests studying for 25-30 minutes followed by 5-10 minute breaks for optimal focus and retention.'
    }
  ];

  const saqs = [
    {
      type: 'saq',
      question: 'Explain the importance of consistent study habits.',
      sampleAnswer: 'Consistent study habits help build long-term retention and understanding. Regular study sessions allow the brain to process and consolidate information effectively.',
      explanation: 'Should mention consistency, retention, and effectiveness of regular study.'
    },
    {
      type: 'saq',
      question: 'What are the benefits of using AI in education?',
      sampleAnswer: 'AI in education provides personalized learning experiences, instant feedback, and adaptive content. It can identify knowledge gaps and offer targeted practice.',
      explanation: 'Should cover personalization, feedback, and adaptive learning.'
    },
    {
      type: 'saq',
      question: 'Describe effective note-taking strategies.',
      sampleAnswer: 'Effective note-taking includes summarizing in your own words, using visual aids like diagrams, and reviewing notes regularly. The Cornell method is particularly effective.',
      explanation: 'Should mention summarization, visual aids, and review techniques.'
    }
  ];

  if (type === 'mcq') {
    return mcqs;
  } else if (type === 'saq') {
    return saqs;
  } else {
    return [...mcqs.slice(0, 3), ...saqs.slice(0, 2)];
  }
}
