import { useState } from 'react';

export const useFormValidation = (initialErrors = {}) => {
  const [errors, setErrors] = useState(initialErrors);

  const validate = (fieldName, value, validators) => {
    const newErrors = { ...errors };

    if (validators?.required && !value?.toString().trim()) {
      newErrors[fieldName] = 'This field is required';
    } else if (validators?.email && !/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value)) {
      newErrors[fieldName] = 'Please enter a valid email';
    } else if (validators?.minLength && value.length < validators.minLength) {
      newErrors[fieldName] = `Minimum length is ${validators.minLength} characters`;
    } else {
      delete newErrors[fieldName];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const clearAllErrors = () => setErrors({});

  return { errors, validate, clearError, clearAllErrors };
};
