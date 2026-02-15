interface Sortable {
  date?: { start: string; end?: string };
  time?: { start: string; end?: string };
}

/**
 * Sorts items descending by date.start, then by time.start.
 * Items without dates are placed at the end.
 */
export function sortByDateTime<T extends Sortable>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    // Compare dates first (descending)
    const dateA = a.date?.start || '';
    const dateB = b.date?.start || '';
    if (dateA !== dateB) return dateB.localeCompare(dateA);

    // Then compare times (descending)
    const timeA = a.time?.start || '';
    const timeB = b.time?.start || '';
    return timeB.localeCompare(timeA);
  });
}

/**
 * Sorts items descending by a plain date string field.
 * Items without dates are placed at the end.
 */
export function sortByDate<T extends { date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = a.date || '';
    const dateB = b.date || '';
    return dateB.localeCompare(dateA);
  });
}
