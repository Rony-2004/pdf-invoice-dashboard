'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { InvoiceForm } from '@/components/InvoiceForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileText, Brain, List } from 'lucide-react';
import { apiService } from '@/lib/api';
import { UploadResponse, ExtractResponse, Vendor, InvoiceData } from '@/types';
import Link from 'next/link';

// Dynamic import for PDF viewer to avoid SSR issues
const PDFViewer = dynamic(() => import('@/components/PDFViewer').then(mod => ({ default: mod.PDFViewer })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading PDF viewer...</div>
});

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadResponse | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 25 * 1024 * 1024) {
        alert('File size must be less than 25MB');
        return;
      }
      setSelectedFile(file);
      setUploadedFile(null);
      setExtractedData(null);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await apiService.uploadPDF(selectedFile);
      setUploadedFile(result);
      console.log('File uploaded successfully:', result);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleExtract = async () => {
    if (!uploadedFile) return;

    setIsExtracting(true);
    setExtractionProgress(0);
    
    // Animate progress
    const progressInterval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 300);

    try {
      const result = await apiService.extractData(uploadedFile.fileId);
      setExtractionProgress(100);
      setTimeout(() => {
        setExtractedData(result);
        console.log('Data extracted successfully:', result);
      }, 500);
    } catch (error) {
      console.error('Extraction failed:', error);
      alert('Extraction failed. Please check your API key and try again.');
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsExtracting(false);
        setExtractionProgress(0);
      }, 1000);
    }
  };

  const handleSave = async (formData: { vendor: unknown; invoice: unknown }) => {
    if (!uploadedFile) return;

    setIsSaving(true);
    try {
      const invoiceData = {
        fileId: uploadedFile.fileId,
        fileName: uploadedFile.fileName,
        vendor: formData.vendor as Vendor,
        invoice: formData.invoice as InvoiceData,
      };
      
      const result = await apiService.invoices.create(invoiceData);
      console.log('Invoice saved successfully:', result);
      alert('Invoice saved successfully!');
      
      // Reset form
      setSelectedFile(null);
      setUploadedFile(null);
      setExtractedData(null);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white">
                <span className="hidden sm:inline">PDF Invoice Dashboard</span>
                <span className="sm:hidden">PDF Dashboard</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/invoices">
                <Button variant="outline" className="border-gray-600 bg-gray-800/50 text-white hover:bg-gray-700 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-4">
                  <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">View All Invoices</span>
                  <span className="sm:hidden">Invoices</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-140px)]">
          {/* Left Panel - PDF Viewer */}
          <div className="bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden order-2 xl:order-1">
            <div className="p-3 sm:p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
              <h2 className="text-base sm:text-lg font-semibold text-white">PDF Viewer</h2>
              
              {/* File Upload */}
              <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="pdf-file" className="text-white text-sm">Select PDF File (max 25MB)</Label>
                  <Input
                    id="pdf-file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="mt-1 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 text-sm"
                  />
                </div>
                
                {selectedFile && !uploadedFile && (
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg w-full sm:w-auto text-sm"
                  >
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload PDF'}
                  </Button>
                )}
                
                {uploadedFile && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button 
                      onClick={handleExtract} 
                      disabled={isExtracting}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg relative overflow-hidden text-sm w-full sm:w-auto"
                    >
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {isExtracting ? (
                        <div className="flex items-center justify-center w-full">
                          <span className="hidden sm:inline">Extracting with Gemini AI...</span>
                          <span className="sm:hidden">Extracting...</span>
                          <div className="ml-2 h-2 w-16 sm:w-24 bg-white/20 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-white transition-all duration-300 ease-out ${isExtracting ? 'animate-pulse' : ''} ${
                                extractionProgress > 0 ? 'w-full' : 'w-0'
                              }`}
                            />
                          </div>
                          <span className="ml-2 text-xs">{Math.round(extractionProgress)}%</span>
                        </div>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Extract with Gemini AI</span>
                          <span className="sm:hidden">Extract Data</span>
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="h-[300px] sm:h-[400px] xl:h-[calc(100%-140px)] bg-gray-800/30">
              <PDFViewer file={selectedFile} />
            </div>
          </div>

          {/* Right Panel - Invoice Form */}
          <div className="bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 overflow-auto order-1 xl:order-2">
            <div className="p-3 sm:p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
              <h2 className="text-base sm:text-lg font-semibold text-white">Invoice Data</h2>
            </div>
            
            <div className="p-3 sm:p-4">
              {!extractedData && !uploadedFile && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="text-center text-white">
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                        <Brain className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-blue-400" />
                      </div>
                      <p className="text-sm sm:text-lg">Upload a PDF and extract data to see the invoice form</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {uploadedFile && (
                <InvoiceForm
                  extractedData={extractedData || undefined}
                  onSave={handleSave}
                  isLoading={isSaving}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
