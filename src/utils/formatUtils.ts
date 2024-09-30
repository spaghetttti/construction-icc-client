export function formatMoney(amount: number): string {
  if (isNaN(amount)) {
    throw new Error('Invalid number');
  }

  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' UZS';
}

export function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
