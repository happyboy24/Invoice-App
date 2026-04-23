export const required = (value) => value?.toString().trim().length > 0;

export const email = (value) => /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(value);

export const minLength = (value, length) => value?.toString().trim().length >= length;

export const positiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};
