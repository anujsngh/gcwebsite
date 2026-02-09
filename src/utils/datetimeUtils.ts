/**
 * Formats a date string from ISO format (YYYY-MM-DD) to readable format (Month Day, Year)
 * @param dateString - Date string in YYYY-MM-DD format (e.g., "2024-03-10")
 * @returns Formatted date string (e.g., "March 10, 2024")
 */
export const formatDate = (dateString: string): string => {
  try {
    // Return empty string if dateString is null, undefined, or empty
    if (!dateString || dateString.trim() === '') {
      return '';
    }

    const date = new Date(dateString + 'T00:00:00'); // Add time to avoid timezone issues
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || ''; // Return original string or empty if formatting fails
  }
};

/**
 * Formats a date range from ISO format to readable format
 * @param start - Start date in YYYY-MM-DD format
 * @param end - Optional end date in YYYY-MM-DD format
 * @returns Formatted date range string
 */
export const formatDateRange = (start: string, end?: string): string => {
  const formattedStart = formatDate(start);

  // If start date is empty, return empty string
  if (!formattedStart) {
    return '';
  }

  if (!end) {
    return formattedStart;
  }

  const formattedEnd = formatDate(end);
  // Only add end date if it exists
  if (formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart;
};

/**
 * Formats a time string from 24-hour format (HH:MM) to 12-hour format with AM/PM
 * @param timeString - Time string in HH:MM format (e.g., "21:00")
 * @returns Formatted time string (e.g., "09:00PM")
 */
export const formatTime = (timeString: string): string => {
  try {
    // Return empty string if timeString is null, undefined, or empty
    if (!timeString || timeString.trim() === '') {
      return '';
    }

    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = minutes || '00';

    if (isNaN(hour) || hour < 0 || hour > 23) {
      return timeString; // Return original if invalid
    }

    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedHour = hour12.toString().padStart(2, '0');

    return `${formattedHour}:${minute}${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString || ''; // Return original string or empty if formatting fails
  }
};

/**
 * Formats a time range from 24-hour format to 12-hour format with AM/PM
 * @param start - Start time in HH:MM format
 * @param end - Optional end time in HH:MM format
 * @returns Formatted time range string
 */
export const formatTimeRange = (start: string, end?: string): string => {
  const formattedStart = formatTime(start);

  // If start time is empty, return empty string
  if (!formattedStart) {
    return '';
  }

  if (!end) {
    return formattedStart;
  }

  const formattedEnd = formatTime(end);
  // Only add end time if it exists
  if (formattedEnd) {
    return `${formattedStart} - ${formattedEnd}`;
  }

  return formattedStart;
};
