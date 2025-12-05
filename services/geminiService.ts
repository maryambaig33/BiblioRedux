import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";
import { MOCK_BOOKS } from "../constants";

// Initialize Gemini
// NOTE: In a real app, strict error handling for missing API keys is essential.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to act as a librarian. It can either recommend books from our "inventory" (Mock Data)
 * or provide general knowledge about rare books.
 */
export const askLibrarian = async (query: string): Promise<{ text: string; recommendations: Book[] }> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // We provide the inventory to the model so it can "query" our database semantically
    const inventoryContext = JSON.stringify(MOCK_BOOKS.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      year: b.year,
      description: b.description,
      tags: b.tags
    })));

    const prompt = `
      You are an expert antiquarian bookseller and librarian.
      
      User Query: "${query}"

      Here is our current inventory of rare books:
      ${inventoryContext}

      Task:
      1. Answer the user's query in a helpful, sophisticated tone suitable for a bibliophile.
      2. If any books from our inventory match the user's request (semantically or directly), list their IDs.
      3. If no books match perfectly, suggest general advice on what to look for regarding their query.

      Output JSON format:
      {
        "answer": "Your text response here...",
        "recommendedBookIds": ["id1", "id2"] (or empty array)
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            recommendedBookIds: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonRes = JSON.parse(response.text || '{}');
    const ids = jsonRes.recommendedBookIds || [];
    const recommendedBooks = MOCK_BOOKS.filter(b => ids.includes(b.id));

    return {
      text: jsonRes.answer,
      recommendations: recommendedBooks
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "My apologies, I am having trouble accessing the archives at the moment. Please try again later.",
      recommendations: []
    };
  }
};

/**
 * Analyzes an image of a book to identify it and estimate value/rarity.
 */
export const identifyBookFromImage = async (base64Image: string): Promise<{ title: string; analysis: string; tags: string[] }> => {
  try {
    // gemini-2.5-flash-image is used for image analysis.
    // It does NOT support responseMimeType or responseSchema.
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity in this demo context
              data: base64Image
            }
          },
          {
            text: `
              Analyze this image of a book. 
              1. Identify the Title and Author if visible or recognizable.
              2. Describe the condition based on visual cues (wear, jacket tears).
              3. Estimate if it looks like a rare edition (First edition, special binding, etc.).
              
              Output JSON:
              {
                "title": "Title - Author",
                "analysis": "Detailed analysis paragraph...",
                "tags": ["Tag1", "Tag2"]
              }
            `
          }
        ]
      }
    });

    // Strip Markdown code fences if present
    const rawText = response.text || '{}';
    const jsonText = rawText.replace(/```json|```/g, '').trim();

    const result = JSON.parse(jsonText);
    return {
      title: result.title || "Unidentified Book",
      analysis: result.analysis || "Could not analyze the image.",
      tags: result.tags || []
    };

  } catch (error) {
    console.error("Visual Search Error:", error);
    return {
      title: "Error",
      analysis: "We encountered an issue analyzing this image.",
      tags: []
    };
  }
};