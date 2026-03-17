# Gender Cell IIT Kanpur — Website

Official website for the **Gender Cell, IIT Kanpur** — an institutional body established under the Sexual Harassment of Women at Workplace (Prevention, Prohibition, and Redressal) Act, 2013. The site provides support resources, event information, blog posts, and ICC (Internal Complaints Committee) details.

**Live site:** https://website-33w.pages.dev/

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 + DaisyUI 4 |
| Routing | React Router DOM 6 (HashRouter) |
| Backend / DB | Firebase (Firestore + Hosting) |
| Animations | Framer Motion, React Awesome Reveal, Swiper |
| Charts | Chart.js + React ChartJS 2 |
| Icons | React Icons |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Firebase project (Firestore enabled)

### Installation

```bash
git clone <repo-url>
cd gcwebsite
npm install
```

### Environment variables

Copy `.env.example` to `.env.local` and fill in your Firebase config:

```bash
cp .env.example .env.local
```

```env
VITE_PUBLIC_FIREBASE_API_KEY=
VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=
VITE_PUBLIC_FIREBASE_PROJECT_ID=
VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=
VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
VITE_PUBLIC_FIREBASE_APP_ID=
VITE_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

The build step runs TypeScript compilation, Vite bundling, and a post-build script that generates `dist/404.html` and `.htaccess` for SPA routing on static hosts.

### Preview production build

```bash
npm run preview
```

### Type checking / linting

```bash
npm run type-check
npm run lint
```

---

## Project Structure

```
src/
├── App.tsx                        # Router + route definitions
├── AppLayout.tsx                  # Root layout (Navbar, Footer, skip links)
├── main.tsx                       # React entry point
├── firebase.ts                    # Firebase initialisation
│
├── context/
│   └── AccessibilityContext.tsx   # Global accessibility state (localStorage-backed)
│
├── hooks/
│   └── useReducedMotion.ts        # Merges OS + user reduced-motion preference
│
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Events.tsx
│   ├── Blogs.tsx / BlogPost.tsx
│   ├── Competitions.tsx
│   ├── Support.tsx
│   ├── Resources.tsx
│   ├── ICC.tsx
│   └── SurveysResult.tsx
│
├── components/
│   ├── Accessibility/             # AccessibilityToolbar, SkipLinks, LiveAnnouncer
│   ├── Navbar/ / Footer/
│   ├── Sections/                  # HomeHero, Faqs, SupportService, etc.
│   ├── Cards/                     # EventCard, GalleryCard, ContactCard, etc.
│   ├── Common/                    # Card, Button, Typography, Section
│   └── Charts/                    # Line, Bar, Pie chart wrappers
│
└── utils/
    ├── firebaseUtils.ts
    ├── datetimeUtils.ts
    ├── sortUtils.ts
    └── imagekitUtils.ts
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/about` | About the Gender Cell |
| `/events` | Events listing |
| `/blogs` | Blog listing |
| `/blogs/:id` | Individual blog post |
| `/competitions` | Competitions |
| `/support` | Support services |
| `/resources` | Resources |
| `/icc` | Internal Complaints Committee |
| `/surveys` | Survey results |

---

## Accessibility (WCAG 2.1 AA)

The site ships a persistent accessibility toolbar (bottom-right) with:

- **Theme** — light / dark / system
- **Contrast** — normal / high-contrast / yellow-black
- **Font size** — normal / large / x-large
- **Font family** — default (Inter) / dyslexic-friendly (Lexend)
- **Reduced motion** — overrides OS preference per-user

Preferences are saved to `localStorage` and applied synchronously before first paint to avoid flash of unstyled content.

Additional features: skip-to-content links, screen-reader live announcer for route changes.

---

## Deployment

The project is configured for three hosting targets:

### Firebase Hosting (primary)

```bash
npm run build
firebase deploy
```

`firebase.json` rewrites all paths to `index.html` for client-side routing.

### Vercel

Push to the main branch — Vercel picks up `vercel.json` automatically.

### GitHub Pages

```bash
npm run build
npx gh-pages -d dist
```

---

## Design Tokens

Custom Tailwind theme (see `tailwind.config.js`):

| Token | Value |
|---|---|
| Primary | `#4F46E5` (slate blue) |
| Secondary | `#14B8A6` (teal) |
| Accent | `#F59E0B` (soft gold) |
| Background | `#F8FAFC` (off-white) |
| Font (body) | Inter |
| Font (headings) | Outfit |
| Font (dyslexic) | Lexend |

DaisyUI themes: `light`, `dark`, `high-contrast`, `yellow-black`.

---

## Data

All dynamic content (events, blog posts, competitions, survey results, resources) is stored in **Firebase Firestore** and fetched at runtime via helpers in `src/utils/firebaseUtils.ts`.
