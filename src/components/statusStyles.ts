// Tailwind classes for each status badge, shared by the roadmap and project cards.
export const statusStyles: Record<string, { badge: string; number: string }> = {
  Complete: { badge: 'bg-green-50 text-green-600', number: 'text-green-500' },
  'In Progress': { badge: 'bg-blue-50 text-blue-600', number: 'text-blue-500' },
  'Up Next': { badge: 'bg-amber-50 text-amber-600', number: 'text-amber-500' },
  Planned: { badge: 'bg-gray-100 text-gray-400', number: 'text-gray-300' },
};

export const getStatusStyle = (status: string) => statusStyles[status] ?? statusStyles.Planned;
