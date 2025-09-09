"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const Invoice_1 = require("../models/Invoice");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// Validation rules
const createInvoiceValidation = [
    (0, express_validator_1.body)('fileId').notEmpty().withMessage('File ID is required'),
    (0, express_validator_1.body)('fileName').notEmpty().withMessage('File name is required'),
    (0, express_validator_1.body)('vendor.name').notEmpty().withMessage('Vendor name is required'),
    (0, express_validator_1.body)('invoice.number').notEmpty().withMessage('Invoice number is required'),
    (0, express_validator_1.body)('invoice.date').notEmpty().withMessage('Invoice date is required'),
    (0, express_validator_1.body)('invoice.lineItems').isArray().withMessage('Line items must be an array')
];
const updateInvoiceValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid invoice ID'),
    (0, express_validator_1.body)('vendor.name').optional().notEmpty().withMessage('Vendor name cannot be empty'),
    (0, express_validator_1.body)('invoice.number').optional().notEmpty().withMessage('Invoice number cannot be empty'),
    (0, express_validator_1.body)('invoice.date').optional().notEmpty().withMessage('Invoice date cannot be empty')
];
// GET /invoices - List all invoices with optional search
router.get('/', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { q } = req.query;
    let filter = {};
    if (q && typeof q === 'string') {
        filter = {
            $or: [
                { 'vendor.name': { $regex: q, $options: 'i' } },
                { 'invoice.number': { $regex: q, $options: 'i' } }
            ]
        };
    }
    const invoices = await Invoice_1.Invoice.find(filter).sort({ createdAt: -1 });
    res.json({
        success: true,
        data: invoices.map(invoice => ({
            ...invoice.toObject(),
            _id: invoice._id.toString()
        }))
    });
}));
// GET /invoices/:id - Get single invoice
router.get('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format',
            message: 'Please provide a valid invoice ID'
        });
    }
    const invoice = await Invoice_1.Invoice.findById(id);
    if (!invoice) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found',
            message: 'The requested invoice does not exist'
        });
    }
    res.json({
        success: true,
        data: {
            ...invoice.toObject(),
            _id: invoice._id.toString()
        }
    });
}));
// POST /invoices - Create new invoice
router.post('/', createInvoiceValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: errors.array().map(err => err.msg).join(', ')
        });
    }
    const invoiceData = req.body;
    invoiceData.createdAt = new Date().toISOString();
    const invoice = new Invoice_1.Invoice(invoiceData);
    await invoice.save();
    res.status(201).json({
        success: true,
        data: {
            ...invoice.toObject(),
            _id: invoice._id.toString()
        },
        message: 'Invoice created successfully'
    });
}));
// PUT /invoices/:id - Update invoice
router.put('/:id', updateInvoiceValidation, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: errors.array().map(err => err.msg).join(', ')
        });
    }
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    const invoice = await Invoice_1.Invoice.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });
    if (!invoice) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found',
            message: 'The requested invoice does not exist'
        });
    }
    res.json({
        success: true,
        data: {
            ...invoice.toObject(),
            _id: invoice._id.toString()
        },
        message: 'Invoice updated successfully'
    });
}));
// DELETE /invoices/:id - Delete invoice
router.delete('/:id', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID format',
            message: 'Please provide a valid invoice ID'
        });
    }
    const invoice = await Invoice_1.Invoice.findByIdAndDelete(id);
    if (!invoice) {
        return res.status(404).json({
            success: false,
            error: 'Invoice not found',
            message: 'The requested invoice does not exist'
        });
    }
    res.json({
        success: true,
        message: 'Invoice deleted successfully'
    });
}));
exports.default = router;
//# sourceMappingURL=invoices.js.map