import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoices } from '../context/InvoiceContext';
import { useFormValidation } from '../hooks/useFormValidation';
import Button from '../components/common/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import TextArea from '../components/ui/TextArea';
import { formatCurrency } from '../utils/formatters';
import { STATUS_OPTIONS, CURRENCY_SYMBOLS, generateId } from '../utils/constants';


const InvoiceFormPage = () => {
  const { id, editMode = false } = useParams();
  const navigate = useNavigate();
  const { allInvoices, addInvoice, updateInvoice } = useInvoices();

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    invoiceDate: '',
    dueDate: '',
    currency: 'USD',
    description: '',
    status: 'draft',
    items: [{ description: '', quantity: 1, price: 0 }],
    total: 0,
  });

  const { errors, validate, clearAllErrors } = useFormValidation();

  useEffect(() => {
    if (id !== 'new' && id !== 'edit') {
      const invoice = allInvoices.find((inv) => inv.id === id);
      if (invoice) {
        setFormData(invoice);
      }
    }
  }, [id, allInvoices]);

  const updateTotal = () => {
    const total = formData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setFormData(prev => ({ ...prev, total }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearAllErrors(field);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'price' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, items: newItems }));
    updateTotal();
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
      updateTotal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const isValid = validate('clientName', formData.clientName, { required: true }) &&
                    validate('invoiceNumber', formData.invoiceNumber, { required: true }) &&
                    validate('invoiceDate', formData.invoiceDate, { required: true }) &&
                    formData.items.every(item =>
                      validate(`items[${item.index}].description`, item.description, { required: true })
                    );

    if (!isValid) return;

    const invoiceData = {
      ...formData,
      id: id === 'new' ? generateId() : id,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    };

    if (id === 'new') {
      addInvoice(invoiceData);
    } else {
      updateInvoice(invoiceData);
    }

    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {id === 'new' ? 'New Invoice' : 'Edit Invoice'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {id === 'new' ? 'Fill out the details below to create a new invoice.' : 'Update the invoice details.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button as={Link} to="/" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Save Invoice</Button>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <Input
          label="Client Name"
          value={formData.clientName}
          onChange={(e) => handleInputChange('clientName', e.target.value)}
          error={errors.clientName}
          required
        />
        <Input
          label="Client Email"
          type="email"
          value={formData.clientEmail}
          onChange={(e) => handleInputChange('clientEmail', e.target.value)}
          error={errors.clientEmail}
        />
        <Input
          label="Invoice Number"
          value={formData.invoiceNumber}
          onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
          error={errors.invoiceNumber}
          required
        />
        <div className="md:col-span-2 lg:col-span-1">
          <Input
            label="Invoice Date"
            type="date"
            value={formData.invoiceDate}
            onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
            error={errors.invoiceDate}
            required
          />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
          />
        </div>
        <Select
          label="Currency"
          value={formData.currency}
          onChange={(e) => handleInputChange('currency', e.target.value)}
          options={Object.entries(CURRENCY_SYMBOLS).map(([value, symbol]) => ({
            value,
            label: `${symbol} ${value}`,
          }))}
        />
        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'pending', label: 'Pending' },
            { value: 'paid', label: 'Paid' },
          ]}
        />
        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Additional notes about this invoice..."
        />
      </div>

      {/* Items */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items</h3>
          <Button type="button" variant="outline" onClick={addItem}>
            Add Item
          </Button>
        </div>
        
        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <Input
                label={`Description ${index + 1}`}
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                containerClassName="md:col-span-2"
                error={errors[`items[${index}].description`]}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Qty"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="h-12"
                />
                <Input
                  label="Price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  className="h-12"
                />
              </div>
              {formData.items.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="md:col-span-3 w-full md:w-auto"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>{formatCurrency(formData.total, formData.currency)}</span>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InvoiceFormPage;
