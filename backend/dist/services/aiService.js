"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class AIService {
    constructor() {
        if (process.env.GEMINI_API_KEY) {
            this.geminiClient = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        }
    }
    getExtractionPrompt() {
        return `
You are an AI assistant that extracts structured data from invoice PDFs. Please extract the following information and return it as a JSON object:

{
  "vendor": {
    "name": "vendor company name",
    "address": "vendor address (optional)",
    "taxId": "tax ID or VAT number (optional)"
  },
  "invoice": {
    "number": "invoice number",
    "date": "invoice date (YYYY-MM-DD format)",
    "currency": "currency code (optional)",
    "subtotal": 0.00,
    "taxPercent": 0.00,
    "total": 0.00,
    "poNumber": "purchase order number (optional)",
    "poDate": "PO date (optional)",
    "lineItems": [
      {
        "description": "item description",
        "unitPrice": 0.00,
        "quantity": 1,
        "total": 0.00
      }
    ]
  }
}

Please ensure all numeric values are numbers (not strings) and dates are in YYYY-MM-DD format. Extract only the information that is clearly visible in the document. Return only the JSON object, no additional text.
`;
    }
    async extractWithGemini(pdfText) {
        if (!this.geminiClient) {
            throw new Error('Gemini API key not configured');
        }
        const model = this.geminiClient.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `${this.getExtractionPrompt()}\n\nPDF Content:\n${pdfText}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        try {
            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Error parsing Gemini response:', error);
            throw new Error('Failed to parse AI response');
        }
    }
    async extractData(pdfText) {
        return this.extractWithGemini(pdfText);
    }
}
exports.AIService = AIService;
//# sourceMappingURL=aiService.js.map