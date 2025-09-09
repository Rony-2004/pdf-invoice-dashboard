"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LineItemSchema = new mongoose_1.Schema({
    description: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true }
});
const VendorSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String },
    taxId: { type: String }
});
const InvoiceDataSchema = new mongoose_1.Schema({
    number: { type: String, required: true },
    date: { type: String, required: true },
    currency: { type: String },
    subtotal: { type: Number },
    taxPercent: { type: Number },
    total: { type: Number },
    poNumber: { type: String },
    poDate: { type: String },
    lineItems: [LineItemSchema]
});
const InvoiceSchema = new mongoose_1.Schema({
    fileId: { type: String, required: true, unique: true },
    fileName: { type: String, required: true },
    vendor: { type: VendorSchema, required: true },
    invoice: { type: InvoiceDataSchema, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    updatedAt: { type: String }
});
// Add text index for search functionality
InvoiceSchema.index({
    'vendor.name': 'text',
    'invoice.number': 'text'
});
exports.Invoice = mongoose_1.default.model('Invoice', InvoiceSchema);
//# sourceMappingURL=Invoice.js.map