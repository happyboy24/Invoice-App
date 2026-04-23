import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import Button from '../components/common/Button';
import InvoiceFilters from '../components/invoices/InvoiceFilters';
import InvoiceList from '../components/invoices/InvoiceList';
import StatusBadge from '../components/common/StatusBadge';

const Dashboard = () => {
  const { invoices } = useInvoices();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Overview</h2>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            {invoices.length === 0 ? 'No invoices' : `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button as={Link} to="/invoices/new" className="whitespace-nowrap">
            New Invoice
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
          >
            Filters
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <InvoiceFilters />
        </div>
      )}

      {/* Invoices List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <InvoiceList />
      </div>
    </div>
  );
};

export default Dashboard;
