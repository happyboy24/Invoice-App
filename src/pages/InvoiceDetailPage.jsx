import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import Button from '../components/common/Button';
import StatusBadge from '../components/common/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import InvoiceDetail from '../components/invoices/InvoiceDetail';
import Modal from '../components/common/Modal';

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const { allInvoices, deleteInvoice } = useInvoices();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const foundInvoice = allInvoices.find((inv) => inv.id === id);
    setInvoice(foundInvoice || null);
  }, [id, allInvoices]);

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Invoice not found</h2>
        <Button as={Link} to="/" variant="outline">
          Back to dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">#{invoice.invoiceNumber}</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{invoice.clientName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={invoice.status} />
          <div className="hidden sm:flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(invoice.total, invoice.currency)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Invoice Details</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Invoice Date</span>
              <span>{formatDate(invoice.invoiceDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Due Date</span>
              <span>{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Status</span>
              <StatusBadge status={invoice.status} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold">{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Items</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {invoice.items?.map((item, index) => (
            <div key={index} className="px-6 py-4 grid grid-cols-3 gap-4 items-center">
              <div className="col-span-2">
                <div className="font-medium text-gray-900 dark:text-white">{item.description}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{item.quantity} × {formatCurrency(item.price, invoice.currency)}</div>
              </div>
              <div className="text-right font-semibold text-gray-900 dark:text-white">
                {formatCurrency(item.quantity * item.price, invoice.currency)}
              </div>
            </div>
          ))}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button as={Link} to="/" variant="outline" className="flex-1 sm:flex-none">
          Back
        </Button>
        <Button
          as={Link}
          to={`/invoices/${id}/edit`}
          variant="outline"
          className="flex-1 sm:flex-none"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 sm:flex-none"
        >
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Invoice"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Are you sure you want to delete invoice <strong>#{invoice.invoiceNumber}</strong>? This action cannot be undone.
        </p>
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteInvoice(id);
              navigate('/');
            }}
            className="flex-1"
          >
            Delete Invoice
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default InvoiceDetailPage;
