import React from 'react';

const Select = ({ 
  label, 
  error, 
  options = [], 
  className = '', 
  containerClassName = '', 
  ...props 
}) => {
  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
          bg-white dark:bg-gray-800 dark:border-gray-600
          text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition duration-200
          ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Select;
