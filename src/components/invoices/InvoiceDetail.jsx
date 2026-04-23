import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceDetail = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice #{invoice.invoiceNumber}</h1>
          <StatusBadge status={invoice.status} className="mt-2" />
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(invoice.total, invoice.currency)}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill From</h3>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <p>Your Company Name</p>
            <p>Your Address</p>
            <p>Your City, State 12345</p>
            <p>your.email@company.com</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bill To</h3>
          <div className="space-y-1 text-gray-700 dark:text-gray-300">
            <p className="font-medium">{invoice.clientName}</p>
            <p>{invoice.clientEmail}</p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Invoice Date</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(invoice.invoiceDate)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Due Date</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{formatDate(invoice.dueDate)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg md:col-span-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Invoice Number</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">#{invoice.invoiceNumber}</p>
        </div>
      </div>

      {/* Items Table */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Items</h3>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Item</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Qty</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {invoice.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {formatCurrency(item.price, invoice.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.quantity * item.price, invoice.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-6 bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {invoice.description && (
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Notes</h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{invoice.description}</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
