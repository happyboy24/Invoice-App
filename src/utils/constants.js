export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'orange' },
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'draft', label: 'Draft', color: 'gray' },
];

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
