import daisyuiPlugin from 'daisyui';

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/*.{jsx,js}",
  "./src/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      primary: "#4F46E5", // Slate Blue
      secondary: "#14B8A6", // Teal
      neutral: "#586577", // Slate Gray (darkened for matte desaturation contrast safety)
      background: "#F5F3EE", // Warm matte off-white
      accent: "#F59E0B", // Soft Gold
      subheading: "#64748B",
      links: "#4F46E5",
      success: "#14B8A6",
      sub2: "#94A3B8",
      lightPurple: "#E0E7FF",
      lightpink: "#F0FDFA",
      purpleshade1: "#6366F1",
      buttonpurple: "#4F46E5",
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      heading: ['Outfit', 'sans-serif'],
      dyslexic: ['Lexend', 'Arial', 'sans-serif'],
    }
  },
};

export const plugins = [daisyuiPlugin];

// DaisyUI configuration — must be a top-level export, not inside theme.extend
export const daisyui = {
  themes: [
    "light",
    "dark",
    {
      "high-contrast": {
        "primary": "#000000",
        "primary-content": "#ffffff",
        "secondary": "#000000",
        "secondary-content": "#ffffff",
        "accent": "#000000",
        "accent-content": "#ffffff",
        "neutral": "#000000",
        "neutral-content": "#ffffff",
        "base-100": "#ffffff",
        "base-200": "#eeeeee",
        "base-300": "#dddddd",
        "base-content": "#000000",
        "info": "#0000cc",
        "info-content": "#ffffff",
        "success": "#006600",
        "success-content": "#ffffff",
        "warning": "#884400",
        "warning-content": "#ffffff",
        "error": "#cc0000",
        "error-content": "#ffffff",
        "--rounded-box": "0",
        "--rounded-btn": "0",
        "--rounded-badge": "0",
        "--tab-radius": "0",
      },
      "yellow-black": {
        "primary": "#ffff00",
        "primary-content": "#000000",
        "secondary": "#ffff00",
        "secondary-content": "#000000",
        "accent": "#ffff00",
        "accent-content": "#000000",
        "neutral": "#333300",
        "neutral-content": "#ffff00",
        "base-100": "#000000",
        "base-200": "#111111",
        "base-300": "#222222",
        "base-content": "#ffff00",
        "info": "#00ffff",
        "info-content": "#000000",
        "success": "#00ff00",
        "success-content": "#000000",
        "warning": "#ffaa00",
        "warning-content": "#000000",
        "error": "#ff4444",
        "error-content": "#000000",
        "--rounded-box": "0",
        "--rounded-btn": "0",
        "--rounded-badge": "0",
        "--tab-radius": "0",
      },
    },
  ],
  darkTheme: "dark",
  base: true,
  styled: true,
  utils: true,
  logs: false,
};
