import { ExtractResponse } from '../types';
export declare class AIService {
    private geminiClient?;
    constructor();
    private getExtractionPrompt;
    extractWithGemini(pdfText: string): Promise<ExtractResponse>;
    extractData(pdfText: string): Promise<ExtractResponse>;
}
//# sourceMappingURL=aiService.d.ts.map