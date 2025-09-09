'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { apiService } from '@/lib/api';
import { Invoice } from '@/types';
import Link from 'next/link';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInvoices(invoices);
    } else {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          invoice.invoice.number.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInvoices(filtered);
    }
  }, [searchQuery, invoices]);

  const loadInvoices = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.invoices.list();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
      alert('Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await apiService.invoices.delete(id);
      await loadInvoices();
      alert('Invoice deleted successfully');
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
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
                <span className="hidden sm:inline">Invoice Management</span>
                <span className="sm:hidden">Invoices</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg text-xs sm:text-sm px-2 sm:px-4">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">New Invoice</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Search */}
        <Card className="mb-4 sm:mb-6 bg-black/40 backdrop-blur-sm border-gray-700/50 shadow-xl">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg">Search Invoices</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                placeholder="Search by vendor name or invoice number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card className="bg-black/40 backdrop-blur-sm border-gray-700/50 shadow-xl">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="text-white text-base sm:text-lg">
              Invoices ({filteredInvoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-white text-sm sm:text-base">Loading invoices...</span>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-500" />
                <p className="text-white text-sm sm:text-base">
                  {searchQuery ? 'No invoices found matching your search' : 'No invoices found'}
                </p>
                <Link href="/">
                  <Button className="mt-3 sm:mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Create Your First Invoice
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredInvoices.map((invoice) => (
                  <Card key={invoice._id} className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 transition-colors">
                    <CardContent className="p-3 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 space-y-2 sm:space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <div>
                              <h3 className="text-sm sm:text-base font-medium text-white">
                                {invoice.invoice.number}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-300">
                                {invoice.fileName}
                              </p>
                            </div>
                            <div className="mt-1 sm:mt-0">
                              <p className="text-sm sm:text-base font-medium text-white">
                                {invoice.vendor.name}
                              </p>
                              {invoice.vendor.address && (
                                <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">
                                  {invoice.vendor.address.length > 30 
                                    ? `${invoice.vendor.address.substring(0, 30)}...` 
                                    : invoice.vendor.address}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm">
                            <div className="text-white">
                              Date: {formatDate(invoice.invoice.date)}
                            </div>
                            <div className="text-black bg-yellow-200 px-2 py-1 rounded font-bold w-fit mt-1 sm:mt-0">
                              {formatCurrency(invoice.invoice.total, invoice.invoice.currency)}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                          <Link href={`/invoices/${invoice._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600 text-xs sm:text-sm px-2 sm:px-3"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(invoice._id!)}
                            className="border-red-600 bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs sm:text-sm px-2 sm:px-3"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
