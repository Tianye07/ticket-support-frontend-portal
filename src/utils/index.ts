// 'in_progress' -> 'In Progress'
export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatDateTime(value?: string | null): string {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleString('en-MY', { dateStyle: 'medium', timeStyle: 'short' });
}

export function getErrorMessage(error: any): string {
  return error?.response?.data?.message ?? 'Something went wrong. Please try again.';
}
