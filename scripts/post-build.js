import { copyFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

// 1. Copy index.html as 404.html
//    Many static hosts (GitHub Pages, Surge, etc.) serve 404.html for unknown paths.
//    This lets React Router handle all routes client-side.
copyFileSync(resolve(distDir, 'index.html'), resolve(distDir, '404.html'));

// 2. Create .htaccess for Apache servers
//    Redirects all requests to index.html so React Router can handle them.
const htaccess = `# SPA fallback - redirect all requests to index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
`;
writeFileSync(resolve(distDir, '.htaccess'), htaccess);

console.log('Post-build: Created 404.html and .htaccess in dist/');
