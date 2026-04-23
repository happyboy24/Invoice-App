import React from 'react';
import { useInvoices } from '../../context/InvoiceContext';
import Select from '../ui/Select';
import { STATUS_OPTIONS } from '../../utils/constants';

const InvoiceFilters = () => {
  const { filters, setFilters, searchTerm, setSearchTerm } = useInvoices();

  const handleStatusChange = (e) => {
    setFilters({ status: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-end">
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search
        </label>
        <input
          type="text"
          placeholder="Search by client name or invoice number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="
            w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
            bg-white dark:bg-gray-800 dark:border-gray-600
            text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition duration-200
          "
        />
      </div>
      <Select
        label="Filter by status"
        value={filters.status}
        onChange={handleStatusChange}
        className="w-full lg:w-48"
        options={[
          { value: 'all', label: 'All statuses' },
          ...STATUS_OPTIONS.map(s => ({ value: s.value, label: s.label })),
        ]}
      />
    </div>
  );
};

export default InvoiceFilters;
