import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAccessibility, ThemeMode, ContrastMode, FontSize } from '../../context/AccessibilityContext';

const FONT_SIZES: FontSize[] = ['normal', 'large', 'x-large'];

const AccessibilityToolbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  const {
    themeMode, contrastMode, fontSize, fontFamily, reducedMotion,
    setThemeMode, setContrastMode, setFontSize, setFontFamily, setReducedMotion, resetAll,
  } = useAccessibility();

  // Close panel with Escape key and return focus to toggle button
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          toggleButtonRef.current && !toggleButtonRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const cycleFontSize = useCallback((direction: 'up' | 'down') => {
    const currentIndex = FONT_SIZES.indexOf(fontSize);
    if (direction === 'up') {
      setFontSize(FONT_SIZES[Math.min(currentIndex + 1, FONT_SIZES.length - 1)]);
    } else {
      setFontSize(FONT_SIZES[Math.max(currentIndex - 1, 0)]);
    }
  }, [fontSize, setFontSize]);

  const handleReset = () => {
    resetAll();
    setIsOpen(false);
  };

  const themeModes: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'Auto', icon: '💻' },
  ];

  const contrastModes: { value: ContrastMode; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'high-contrast', label: 'High Contrast' },
    { value: 'yellow-black', label: 'Yellow/Black' },
  ];

  return (
    <div className="fixed bottom-6 right-4 z-[9998] flex flex-col items-end gap-2">
      {/* Expandable Settings Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          id="a11y-panel"
          role="dialog"
          aria-label="Accessibility Settings"
          aria-modal="false"
          className="bg-base-100 border-2 border-base-300 rounded-2xl shadow-2xl p-5 w-72 text-base-content"
        >
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <span aria-hidden="true">♿</span>
            Accessibility
          </h2>

          {/* Theme */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/90 mb-2">
              Theme
            </p>
            <div role="group" aria-label="Theme selection" className="flex gap-1">
              {themeModes.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setThemeMode(value)}
                  aria-pressed={themeMode === value}
                  className={`flex-1 btn btn-sm gap-1 ${themeMode === value ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                  title={label}
                >
                  <span aria-hidden="true">{icon}</span>
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Contrast */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/90 mb-2">
              Contrast
            </p>
            <div role="group" aria-label="Contrast mode selection" className="flex flex-col gap-1">
              {contrastModes.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setContrastMode(value)}
                  aria-pressed={contrastMode === value}
                  className={`btn btn-sm justify-start ${contrastMode === value ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
                >
                  {contrastMode === value && (
                    <span aria-hidden="true" className="mr-1">✓</span>
                  )}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/90 mb-2">
              Text Size
            </p>
            <div role="group" aria-label="Text size controls" className="flex items-center gap-2">
              <button
                onClick={() => cycleFontSize('down')}
                aria-label="Decrease text size"
                disabled={fontSize === 'normal'}
                className="btn btn-sm btn-ghost border border-base-300 w-10 font-bold disabled:opacity-40"
              >
                A-
              </button>
              <span className="flex-1 text-center text-sm capitalize" aria-live="polite" aria-atomic="true">
                {fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Large' : 'X-Large'}
              </span>
              <button
                onClick={() => cycleFontSize('up')}
                aria-label="Increase text size"
                disabled={fontSize === 'x-large'}
                className="btn btn-sm btn-ghost border border-base-300 w-10 font-bold disabled:opacity-40"
              >
                A+
              </button>
            </div>
          </div>

          {/* Dyslexia-Friendly Font */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/90 mb-2">
              Font
            </p>
            <button
              onClick={() => setFontFamily(fontFamily === 'dyslexic' ? 'default' : 'dyslexic')}
              aria-pressed={fontFamily === 'dyslexic'}
              className={`btn btn-sm w-full justify-start ${fontFamily === 'dyslexic' ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
            >
              {fontFamily === 'dyslexic' && <span aria-hidden="true" className="mr-1">✓</span>}
              Dyslexia-Friendly Font
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-base-content/90 mb-2">
              Motion
            </p>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              aria-pressed={reducedMotion}
              className={`btn btn-sm w-full justify-start ${reducedMotion ? 'btn-primary' : 'btn-ghost border border-base-300'}`}
            >
              {reducedMotion && <span aria-hidden="true" className="mr-1">✓</span>}
              Reduce Animations
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="btn btn-sm btn-outline btn-error w-full"
          >
            Reset All Settings
          </button>
        </div>
      )}

      {/* Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        aria-label={isOpen ? 'Close accessibility settings' : 'Open accessibility settings'}
        className="btn btn-circle btn-primary shadow-lg w-14 h-14 text-xl"
        title="Accessibility Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
          aria-hidden="true"
        >
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 6c1.1 0 2 .9 2 2v1h2a1 1 0 1 1 0 2h-.28l-.72 5H9l-.72-5H8a1 1 0 1 1 0-2h2v-1c0-1.1.9-2 2-2z" />
        </svg>
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
