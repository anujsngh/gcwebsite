import React from 'react';

const handleSkip = (targetId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const target = document.getElementById(targetId);
  if (target) {
    // tabindex=-1 allows programmatic focus on non-interactive elements
    target.setAttribute('tabindex', '-1');
    target.focus();
    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }
};

const SkipLinks: React.FC = () => (
  <div>
    <a
      href="#main-content"
      className="skip-link"
      onClick={handleSkip('main-content')}
    >
      Skip to main content
    </a>
    <a
      href="#site-navigation"
      className="skip-link"
      onClick={handleSkip('site-navigation')}
    >
      Skip to navigation
    </a>
  </div>
);

export default SkipLinks;
