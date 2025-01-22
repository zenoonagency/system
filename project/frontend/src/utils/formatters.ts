export const formatCurrency = (value: number): string => {
  // Handle undefined, null, or NaN values
  if (value === undefined || value === null || isNaN(value)) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }

  // Ensure value is a number and handle negative values
  const numberValue = typeof value === 'string' ? parseFloat(value) : value;

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberValue);
};