import { ChatOpenAI } from '@langchain/openai';
import { searchPDF } from './pdfService.js';

/**
 * Chat with PDF using RAG (Retrieval-Augmented Generation)
 */
export async function chatWithPDF(question, pdfId) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Search for relevant context
    const relevantDocs = await searchPDF(pdfId, question, 3);

    // Build context from retrieved documents
    const context = relevantDocs
      .map((doc, idx) => `[${idx + 1}] ${doc.text}`)
      .join('\n\n');

    // Create LLM instance
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    // Create prompt
    const prompt = `You are a helpful study assistant. Answer the student's question based on the context from their textbook.

Context from the textbook:
${context}

Question: ${question}

Instructions:
- Answer clearly and concisely
- Use information from the context when possible
- If the context doesn't contain the answer, say so and provide general knowledge if appropriate
- Cite specific parts of the text when relevant (e.g., "According to the text...")
- Be encouraging and supportive

Answer:`;

    // Get response
    const response = await llm.invoke(prompt);

    // Extract citations
    const citations = relevantDocs.map((doc, idx) => ({
      page: doc.metadata?.loc?.pageNumber || idx + 1,
      text: doc.text.substring(0, 100) + '...',
    }));

    return {
      answer: response.content,
      citations,
    };
  } catch (error) {
    console.error('Chat service error:', error);
    
    // Fallback response when OpenAI is not configured
    if (error.message.includes('API key')) {
      return {
        answer: 'OpenAI API is not configured. Please add your OPENAI_API_KEY to the .env file to enable AI-powered chat.',
        citations: [],
      };
    }
    
    throw error;
  }
}
