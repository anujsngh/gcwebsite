import React from 'react';

interface LiveAnnouncerProps {
  message: string;
}

/**
 * A visually-hidden aria-live region for announcing route changes to screen readers.
 * Must be present in the DOM before messages are set (do not mount conditionally).
 */
const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({ message }) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

export default LiveAnnouncer;
