import mongoose, { Document } from 'mongoose';
import { Vendor, InvoiceData } from '../types';
interface InvoiceDocument extends Document {
    fileId: string;
    fileName: string;
    vendor: Vendor;
    invoice: InvoiceData;
    createdAt: string;
    updatedAt?: string;
}
export declare const Invoice: mongoose.Model<InvoiceDocument, {}, {}, {}, mongoose.Document<unknown, {}, InvoiceDocument, {}, {}> & InvoiceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=Invoice.d.ts.map