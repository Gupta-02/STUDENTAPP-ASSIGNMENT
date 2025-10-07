import fs from 'fs/promises';
import pdfParse from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from '@langchain/openai';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import path from 'path';

// Store for managing vector databases
const vectorStores = new Map();

/**
 * Process a PDF file: extract text, chunk it, and create embeddings
 */
export async function processPDF(filePath, pdfId) {
  try {
    console.log(`📄 Processing PDF: ${pdfId}`);

    // Read PDF file
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);

    console.log(`📖 Extracted ${data.numpages} pages from PDF`);

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await textSplitter.createDocuments([data.text]);

    console.log(`✂️  Created ${chunks.length} chunks from PDF`);

    // Create embeddings and vector store
    if (process.env.OPENAI_API_KEY) {
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });

      const vectorStore = await FaissStore.fromDocuments(chunks, embeddings);

      // Save vector store
      const vectorStorePath = path.join('vector_store', pdfId);
      await vectorStore.save(vectorStorePath);

      // Cache in memory
      vectorStores.set(pdfId, vectorStore);

      console.log(`✅ Vector store created and saved for ${pdfId}`);
    } else {
      console.warn('⚠️  OpenAI API key not found. Skipping embeddings.');
    }

    return {
      success: true,
      pages: data.numpages,
      chunks: chunks.length,
    };
  } catch (error) {
    console.error('❌ PDF processing error:', error);
    throw error;
  }
}

/**
 * Get vector store for a PDF
 */
export async function getVectorStore(pdfId) {
  // Check memory cache
  if (vectorStores.has(pdfId)) {
    return vectorStores.get(pdfId);
  }

  // Try to load from disk
  try {
    const vectorStorePath = path.join('vector_store', pdfId);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await FaissStore.load(vectorStorePath, embeddings);
    vectorStores.set(pdfId, vectorStore);

    return vectorStore;
  } catch (error) {
    console.error('Vector store not found for PDF:', pdfId);
    return null;
  }
}

/**
 * Search for relevant content in PDF
 */
export async function searchPDF(pdfId, query, k = 3) {
  try {
    const vectorStore = await getVectorStore(pdfId);

    if (!vectorStore) {
      throw new Error('PDF not processed or vector store not found');
    }

    const results = await vectorStore.similaritySearch(query, k);

    return results.map(doc => ({
      text: doc.pageContent,
      metadata: doc.metadata,
    }));
  } catch (error) {
    console.error('PDF search error:', error);
    throw error;
  }
}
