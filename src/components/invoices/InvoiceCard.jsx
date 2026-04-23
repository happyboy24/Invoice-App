import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';

const InvoiceCard = ({ invoice, onDelete }) => {
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900 dark:text-white">#{invoice.invoiceNumber}</span>
            <StatusBadge status={invoice.status} />
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
            <span>{invoice.clientName}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
            </svg>
            <span>{formatDate(invoice.dueDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
          <div className="flex gap-1">
            <Link
              to={`/invoices/${invoice.id}`}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap"
            >
              View
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="px-3 py-1.5 h-auto"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
