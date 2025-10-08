import { Question } from './storage';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
// API base URL - use environment variable in production, relative path in development
const API_BASE_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://smart-study-assistant-backend.onrender.com');

export async function generateQuizQuestions(
  pdfContext: string,
  type: 'mcq' | 'saq' | 'laq' | 'mixed',
  count: number = 5,
  pdfId?: string
): Promise<Question[]> {
  // If we have a pdfId, use the backend API
  if (pdfId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfId,
          type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const questions = data.questions.map((q: { id?: string; type?: string; question: string; options?: string[]; correctAnswer: string; explanation?: string; topic?: string }, index: number) => ({
          id: q.id || `q${index + 1}`,
          type: q.type || type,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          topic: q.topic || 'General',
        }));

        // Limit questions to the requested count
        return questions.slice(0, count);
      }
    } catch (error) {
      console.error('Error calling backend quiz API:', error);
    }
  }

  // Fallback to OpenAI API if backend fails or no pdfId
  if (!OPENAI_API_KEY) {
    return generateMockQuestions(type, count, pdfContext);
  }

  try {
    const prompt = createQuizPrompt(pdfContext, type, count);
    const messages = [
      { role: 'user', content: prompt },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.3, // Lower temperature for more consistent quiz questions
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse the JSON response
    const questions = JSON.parse(content);

    // Validate and format the questions
    return questions.map((q: { id?: string; type?: string; question: string; options?: string[]; correctAnswer: string; explanation?: string; topic?: string }, index: number) => ({
      id: q.id || `q${index + 1}`,
      type: q.type || type,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      topic: q.topic || 'General',
    }));
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return generateMockQuestions(type, count, pdfContext);
  }
}

export async function generateChatResponse(
  message: string,
  pdfContext: string,
  conversationHistory: Array<{ role: string; content: string }>,
  pdfId?: string
): Promise<{ content: string; citations: Array<{ page: number; snippet: string; pdfId: string }> }> {
  // If we have a pdfId, use the backend API for RAG
  if (pdfId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          pdfId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          content: data.response,
          citations: data.citations || [],
        };
      }
    } catch (error) {
      console.error('Error calling backend chat API:', error);
    }
  }

  // Fallback to OpenAI API if backend fails or no pdfId
  if (!OPENAI_API_KEY) {
    return generateMockChatResponse(message);
  }

  try {
    const prompt = createChatPrompt(message, pdfContext);
    const messages = [
      ...conversationHistory.slice(-6),
      { role: 'user', content: prompt },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;

    const citations = extractCitations(content);
    return { content, citations };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return generateMockChatResponse(message);
  }
}

export async function recommendYouTubeVideos(topic: string): Promise<Array<{
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
}>> {
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

  if (!YOUTUBE_API_KEY) {
    return generateMockYouTubeVideos(topic);
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic + ' physics class 11')}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();
    return data.items.map((item: { id: { videoId: string }; snippet: { title: string; channelTitle: string; thumbnails: { medium: { url: string } } } }) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium.url,
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return generateMockYouTubeVideos(topic);
  }
}

function createQuizPrompt(context: string, type: string, count: number): string {
  const typeDescription = type === 'mcq' ? 'multiple choice questions with 4 options'
    : type === 'saq' ? 'short answer questions'
    : type === 'laq' ? 'long answer questions'
    : 'mixed types of questions';

  return `Generate ${count} ${typeDescription} based on this physics content. Return a JSON array with this structure:
[{
  "id": "unique_id",
  "type": "${type === 'mixed' ? 'mcq|saq|laq' : type}",
  "question": "question text",
  ${type === 'mcq' || type === 'mixed' ? '"options": ["A", "B", "C", "D"],' : ''}
  "correctAnswer": "correct answer",
  "explanation": "detailed explanation",
  "topic": "topic name"
}]

Context: ${context.substring(0, 3000)}`;
}

function createChatPrompt(message: string, context: string): string {
  return `You are a helpful physics tutor. Answer this question based on the textbook content. Include specific page references when possible.

Context from textbook: ${context.substring(0, 2000)}

Student question: ${message}

Provide a clear, educational response with citations in the format: (p. X: "quote")`;
}

function extractCitations(content: string): Array<{ page: number; snippet: string; pdfId: string }> {
  const citations: Array<{ page: number; snippet: string; pdfId: string }> = [];
  const regex = /\(p\.\s*(\d+):\s*"([^"]+)"\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    citations.push({
      page: parseInt(match[1]),
      snippet: match[2],
      pdfId: 'default',
    });
  }

  return citations;
}

function generateMockQuestions(type: 'mcq' | 'saq' | 'laq' | 'mixed', count: number, pdfContext?: string): Question[] {
  const questions: Question[] = [];

  // Determine subject based on PDF context
  let subject = 'physics'; // default
  if (pdfContext) {
    const lowerContext = pdfContext.toLowerCase();
    if (lowerContext.includes('chemistry') || lowerContext.includes('chemical') || lowerContext.includes('reaction')) {
      subject = 'chemistry';
    } else if (lowerContext.includes('math') || lowerContext.includes('mathematics') || lowerContext.includes('calculus') || lowerContext.includes('algebra')) {
      subject = 'math';
    } else if (lowerContext.includes('biology') || lowerContext.includes('cell') || lowerContext.includes('organism')) {
      subject = 'biology';
    }
  }

  // Define topic-based questions for different subjects
  const questionSets = {
    physics: [
      {
        type: 'mcq' as const,
        question: 'What is the SI unit of force?',
        options: ['Newton', 'Joule', 'Watt', 'Pascal'],
        correctAnswer: 'Newton',
        explanation: 'The SI unit of force is Newton (N), named after Sir Isaac Newton.',
        topic: 'Units and Measurements',
      },
      {
        type: 'saq' as const,
        question: 'State Newton\'s First Law of Motion.',
        correctAnswer: 'An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an unbalanced force.',
        explanation: 'This law is also known as the law of inertia.',
        topic: 'Laws of Motion',
      },
      {
        type: 'laq' as const,
        question: 'Explain the work-energy theorem with an example.',
        correctAnswer: 'The work-energy theorem states that the net work done on an object equals its change in kinetic energy.',
        explanation: 'Work done by all forces = Change in kinetic energy.',
        topic: 'Work, Energy and Power',
      },
    ],
    chemistry: [
      {
        type: 'mcq' as const,
        question: 'What is the atomic number of Carbon?',
        options: ['6', '12', '14', '16'],
        correctAnswer: '6',
        explanation: 'Carbon has 6 protons in its nucleus, so its atomic number is 6.',
        topic: 'Atomic Structure',
      },
      {
        type: 'saq' as const,
        question: 'Define chemical bonding.',
        correctAnswer: 'Chemical bonding is the attractive force that holds atoms together in compounds.',
        explanation: 'Chemical bonds form when atoms share or transfer electrons to achieve stable electron configurations.',
        topic: 'Chemical Bonding',
      },
      {
        type: 'laq' as const,
        question: 'Explain the difference between exothermic and endothermic reactions.',
        correctAnswer: 'Exothermic reactions release heat energy, while endothermic reactions absorb heat energy.',
        explanation: 'In exothermic reactions, ΔH is negative (heat is released), while in endothermic reactions, ΔH is positive (heat is absorbed).',
        topic: 'Thermochemistry',
      },
    ],
    math: [
      {
        type: 'mcq' as const,
        question: 'What is the value of π (pi) approximately?',
        options: ['3.14', '3.1416', '3.14159', '3.1415926535'],
        correctAnswer: '3.14159',
        explanation: 'π is an irrational number approximately equal to 3.14159.',
        topic: 'Geometry',
      },
      {
        type: 'saq' as const,
        question: 'What is the derivative of x²?',
        correctAnswer: '2x',
        explanation: 'The power rule states that the derivative of x^n is n*x^(n-1).',
        topic: 'Calculus',
      },
      {
        type: 'laq' as const,
        question: 'Prove that the sum of angles in a triangle is 180 degrees.',
        correctAnswer: 'Draw a line parallel to one side through the opposite vertex. The alternate interior angles formed will show that the sum is 180 degrees.',
        explanation: 'This is a fundamental property of Euclidean geometry.',
        topic: 'Geometry',
      },
    ],
    biology: [
      {
        type: 'mcq' as const,
        question: 'What is the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'],
        correctAnswer: 'Mitochondria',
        explanation: 'Mitochondria are responsible for producing ATP, the cell\'s energy currency.',
        topic: 'Cell Biology',
      },
      {
        type: 'saq' as const,
        question: 'What is photosynthesis?',
        correctAnswer: 'Photosynthesis is the process by which plants convert light energy into chemical energy.',
        explanation: 'Plants use chlorophyll to capture sunlight and convert CO2 and water into glucose and oxygen.',
        topic: 'Plant Physiology',
      },
      {
        type: 'laq' as const,
        question: 'Explain the process of DNA replication.',
        correctAnswer: 'DNA replication is semi-conservative, involving unwinding of the double helix, complementary base pairing, and formation of two identical DNA molecules.',
        explanation: 'Each daughter DNA molecule contains one original strand and one newly synthesized strand.',
        topic: 'Molecular Biology',
      },
    ],
  };

  const selectedQuestions = questionSets[subject as keyof typeof questionSets] || questionSets.physics;

  for (let i = 0; i < count; i++) {
    const questionType = type === 'mixed'
      ? (['mcq', 'saq', 'laq'] as const)[i % 3]
      : type;

    const baseQuestion = selectedQuestions[i % selectedQuestions.length];

    // Adjust type if needed
    const finalType = questionType === 'mcq' ? 'mcq' : questionType === 'saq' ? 'saq' : 'laq';

    const question: Question = {
      id: `q${i + 1}`,
      type: finalType,
      question: baseQuestion.question,
      correctAnswer: baseQuestion.correctAnswer,
      explanation: baseQuestion.explanation,
      topic: baseQuestion.topic,
    };

    if (finalType === 'mcq' && baseQuestion.options) {
      question.options = baseQuestion.options;
    }

    questions.push(question);
  }

  return questions;
}

function generateMockChatResponse(message: string): {
  content: string;
  citations: Array<{ page: number; snippet: string; pdfId: string }>;
} {
  return {
    content: `Great question about "${message}"! Based on the physics textbook, here's what I can explain:\n\nThe concept you're asking about relates to fundamental principles in physics. (p. 45: "Force is defined as the rate of change of momentum") This means that when we apply force to an object, we're essentially changing its momentum over time.\n\nKey points to remember:\n1. Force and motion are interconnected\n2. Understanding units is crucial\n3. Real-world applications help solidify concepts\n\nWould you like me to elaborate on any specific aspect?`,
    citations: [
      { page: 45, snippet: 'Force is defined as the rate of change of momentum', pdfId: 'ncert-physics-xi-1' },
    ],
  };
}

function generateMockYouTubeVideos(topic: string): Array<{
  videoId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
}> {
  return [
    {
      videoId: 'dQw4w9WgXcQ',
      title: `${topic} - Complete Explanation | Class 11 Physics`,
      channel: 'Physics Wallah',
      thumbnailUrl: 'https://images.pexels.com/photos/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      videoId: 'dQw4w9WgXcQ2',
      title: `${topic} in Hindi | NCERT Class 11`,
      channel: 'Khan Academy India',
      thumbnailUrl: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      videoId: 'dQw4w9WgXcQ3',
      title: `Understanding ${topic} | Animation`,
      channel: 'Vedantu',
      thumbnailUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];
}
