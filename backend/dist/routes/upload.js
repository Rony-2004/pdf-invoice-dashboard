"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});
// POST /upload - Upload PDF file
router.post('/', upload.single('pdf'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            error: 'No file uploaded',
            message: 'Please select a PDF file to upload'
        });
    }
    try {
        // Create GridFS bucket for file storage
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('Database connection not available');
        }
        const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'pdfs' });
        // Create upload stream
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            metadata: {
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                uploadDate: new Date()
            }
        });
        // Upload the file
        uploadStream.end(req.file.buffer);
        // Wait for upload to complete
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', resolve);
            uploadStream.on('error', reject);
        });
        return res.json({
            success: true,
            data: {
                fileId: uploadStream.id.toString(),
                fileName: req.file.originalname
            }
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            success: false,
            error: 'Upload failed',
            message: 'Failed to upload file to storage'
        });
    }
}));
exports.default = router;
//# sourceMappingURL=upload.js.map