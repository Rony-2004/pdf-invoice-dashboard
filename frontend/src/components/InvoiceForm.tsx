'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Invoice, ExtractResponse } from '@/types';

const lineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  unitPrice: z.number().min(0, 'Unit price must be positive'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  total: z.number().min(0, 'Total must be positive'),
});

const invoiceSchema = z.object({
  vendor: z.object({
    name: z.string().min(1, 'Vendor name is required'),
    address: z.string().optional(),
    taxId: z.string().optional(),
  }),
  invoice: z.object({
    number: z.string().min(1, 'Invoice number is required'),
    date: z.string().min(1, 'Invoice date is required'),
    currency: z.string().optional(),
    subtotal: z.number().optional(),
    taxPercent: z.number().optional(),
    total: z.number().optional(),
    poNumber: z.string().optional(),
    poDate: z.string().optional(),
    lineItems: z.array(lineItemSchema),
  }),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  extractedData?: ExtractResponse;
  existingInvoice?: Invoice;
  onSave: (data: InvoiceFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  isLoading?: boolean;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  extractedData,
  existingInvoice,
  onSave,
  onDelete,
  isLoading = false,
}) => {
  const defaultValues: InvoiceFormData = extractedData || existingInvoice || {
    vendor: { name: '', address: '', taxId: '' },
    invoice: {
      number: '',
      date: '',
      currency: 'USD',
      subtotal: 0,
      taxPercent: 0,
      total: 0,
      poNumber: '',
      poDate: '',
      lineItems: [{ description: '', unitPrice: 0, quantity: 1, total: 0 }],
    },
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues,
  });

  // Update form when extractedData changes
  React.useEffect(() => {
    if (extractedData) {
      console.log('Updating form with extracted data:', extractedData);
      reset(extractedData);
    }
  }, [extractedData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invoice.lineItems',
  });

  const watchedLineItems = watch('invoice.lineItems');

  // Calculate totals when line items change
  React.useEffect(() => {
    let subtotal = 0;
    watchedLineItems.forEach((item, index) => {
      const lineTotal = item.unitPrice * item.quantity;
      setValue(`invoice.lineItems.${index}.total`, lineTotal);
      subtotal += lineTotal;
    });
    
    setValue('invoice.subtotal', subtotal);
    
    const taxPercent = watch('invoice.taxPercent') || 0;
    const total = subtotal + (subtotal * taxPercent / 100);
    setValue('invoice.total', total);
  }, [watchedLineItems, setValue, watch]);

  const onSubmit = async (data: InvoiceFormData) => {
    await onSave(data);
  };

  const addLineItem = () => {
    append({ description: '', unitPrice: 0, quantity: 1, total: 0 });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Vendor Information */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-700/50 p-3 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg">Vendor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <div>
              <Label htmlFor="vendor.name" className="text-white text-sm">Vendor Name *</Label>
              <Input
                id="vendor.name"
                {...register('vendor.name')}
                placeholder="Enter vendor name"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 text-sm mt-1"
              />
              {errors.vendor?.name && (
                <p className="text-xs sm:text-sm text-red-400 mt-1">{errors.vendor.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="vendor.address" className="text-white text-sm">Address</Label>
              <Input
                id="vendor.address"
                {...register('vendor.address')}
                placeholder="Enter vendor address"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="vendor.taxId" className="text-white">Tax ID</Label>
              <Input
                id="vendor.taxId"
                {...register('vendor.taxId')}
                placeholder="Enter tax ID"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Information */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-700/50">
            <CardTitle className="text-white">Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice.number" className="text-white">Invoice Number *</Label>
                <Input
                  id="invoice.number"
                  {...register('invoice.number')}
                  placeholder="Enter invoice number"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
                {errors.invoice?.number && (
                  <p className="text-sm text-red-600 mt-1">{errors.invoice.number.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="invoice.date" className="text-white">Invoice Date *</Label>
                <Input
                  id="invoice.date"
                  type="date"
                  {...register('invoice.date')}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
                {errors.invoice?.date && (
                  <p className="text-sm text-red-600 mt-1">{errors.invoice.date.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice.currency" className="text-white">Currency</Label>
                <Input
                  id="invoice.currency"
                  {...register('invoice.currency')}
                  placeholder="USD"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="invoice.taxPercent" className="text-white">Tax Percent</Label>
                <Input
                  id="invoice.taxPercent"
                  type="number"
                  step="0.01"
                  {...register('invoice.taxPercent', { valueAsNumber: true })}
                  placeholder="8.5"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoice.poNumber" className="text-white">PO Number</Label>
                <Input
                  id="invoice.poNumber"
                  {...register('invoice.poNumber')}
                  placeholder="Enter PO number"
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="invoice.poDate" className="text-white">PO Date</Label>
                <Input
                  id="invoice.poDate"
                  type="date"
                  {...register('invoice.poDate')}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-700/50">
            <CardTitle className="flex items-center justify-between text-white">
              Line Items
              <Button type="button" onClick={addLineItem} size="sm" className="bg-blue-500/20 border-blue-500 text-blue-400 hover:bg-blue-500/30">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-5 gap-4 items-end">
                  <div>
                    <Label htmlFor={`invoice.lineItems.${index}.description`} className="text-white">Description</Label>
                    <Input
                      {...register(`invoice.lineItems.${index}.description`)}
                      placeholder="Enter description"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`invoice.lineItems.${index}.unitPrice`} className="text-white">Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`invoice.lineItems.${index}.unitPrice`, { valueAsNumber: true })}
                      placeholder="0.00"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`invoice.lineItems.${index}.quantity`} className="text-white">Quantity</Label>
                    <Input
                      type="number"
                      {...register(`invoice.lineItems.${index}.quantity`, { valueAsNumber: true })}
                      placeholder="1"
                      className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`invoice.lineItems.${index}.total`} className="text-white">Total</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`invoice.lineItems.${index}.total`, { valueAsNumber: true })}
                      readOnly
                      className="bg-gray-50 text-black font-semibold"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 max-w-md ml-auto">
                <div>
                  <Label htmlFor="invoice.subtotal" className="text-white">Subtotal</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('invoice.subtotal', { valueAsNumber: true })}
                    readOnly
                    className="bg-gray-50 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="invoice.total" className="text-white">Total</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('invoice.total', { valueAsNumber: true })}
                    readOnly
                    className="bg-gray-50 font-bold text-black text-lg"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg glow-blue"
          >
            {isLoading ? 'Saving...' : 'Save Invoice'}
          </Button>
          
          {onDelete && existingInvoice && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
            >
              Delete Invoice
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
