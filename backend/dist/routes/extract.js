"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const aiService_1 = require("../services/aiService");
const router = express_1.default.Router();
const aiService = new aiService_1.AIService();
// Mock PDF text extraction for demo purposes
// In production, you'd extract text from the actual PDF file
const mockPdfText = `
INVOICE

Vendor: ABC Technology Solutions
Address: 123 Business St, Tech City, TC 12345
Tax ID: TAX123456789

Invoice Number: INV-2024-001
Invoice Date: 2024-03-15
Currency: USD

Bill To:
XYZ Corporation
456 Client Ave
Business Town, BT 67890

Description                    Qty    Unit Price    Total
Web Development Services        1      $5000.00     $5000.00
Database Setup                  1      $1500.00     $1500.00
Testing & QA                   1      $1000.00     $1000.00

Subtotal:                                          $7500.00
Tax (8.5%):                                        $637.50
Total:                                             $8137.50

Purchase Order: PO-2024-100
PO Date: 2024-03-10
`;
// Validation rules
const extractValidation = [
    (0, express_validator_1.body)('fileId').notEmpty().withMessage('File ID is required')
];
// POST /extract - Extract data from PDF using AI
router.post('/', extractValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: errors.array().map(err => err.msg).join(', ')
        });
    }
    const { fileId } = req.body;
    try {
        // In production, you would:
        // 1. Retrieve the PDF file using fileId from MongoDB GridFS
        // 2. Extract text from the PDF using pdf-parse or similar library
        // 3. Pass the extracted text to AI service
        // For demo purposes, using mock PDF text
        const extractedData = await aiService.extractData(mockPdfText);
        res.json({
            success: true,
            data: extractedData
        });
    }
    catch (error) {
        console.error('Extraction error:', error);
        res.status(500).json({
            success: false,
            error: 'Extraction failed',
            message: error instanceof Error ? error.message : 'Failed to extract data from PDF'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=extract.js.map