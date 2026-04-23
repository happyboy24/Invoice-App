import React from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../../context/InvoiceContext';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { formatCurrency, formatDate } from '../../utils/formatters';
import InvoiceCard from './InvoiceCard';

const InvoiceList = () => {
  const { invoices, deleteInvoice } = useInvoices();

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No invoices</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create your first invoice to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice.id} invoice={invoice} onDelete={() => deleteInvoice(invoice.id)} />
      ))}
    </div>
  );
};

export default InvoiceList;
