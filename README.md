# Electronic Hub

Electronic Hub is a full-stack electronics marketplace demo with a responsive Next.js storefront and an Express API.

## Storefront

- Shop phones, computers, and audio devices in separate categories.
- Use the Admin page to create custom categories and add devices with descriptions, photos, and editable specification rows. Admin additions persist in the current browser and appear in catalog, brand, cart, and comparison views.
- Admin can replace an existing device's image by URL; theme settings can be changed from the Theme page and persist in the current browser.
- Available themes include Aurora, Ocean, Sunset, Daylight, Forest, Rose, Cyberpunk, and Graphite. Preview themes live across the site before applying; the chosen theme persists in this browser.
- Open a device to view its description and specifications.
- Search the catalog, filter by brand, and select products to view details.
- Save favorites, add products to the cart, and build a comparison list. These lists persist in the current browser.
- Browse real Unsplash product-category photography; images are illustrative rather than exact product photos.
- Catalog items and prices are sample data. Cart checkout and seller application forms are interactive previews and do not take payments or transmit personal details.

## Getting started

1. Install dependencies: `npm install`
2. Start supporting services if needed: `docker compose up -d postgres redis`
3. Run the storefront and API: `npm run dev`
4. Open the storefront at [http://localhost:3000](http://localhost:3000).
5. The API is available at [http://localhost:4000/api/v1](http://localhost:4000/api/v1).

## Technology

- Frontend: Next.js, React, TypeScript, CSS
- Backend: Express, TypeScript
- Local support services: PostgreSQL and Redis via Docker Compose

## Admin and database setup

- Copy `apps/backend/.env.example` to `apps/backend/.env` and `apps/frontend/.env.example` to `apps/frontend/.env.local`.
- Set a unique `ADMIN_PASSWORD` of at least 12 characters and the same randomly generated `ADMIN_SESSION_SECRET` (at least 32 characters) in both environment files. Keep both files private.
- Start PostgreSQL with `docker compose up -d postgres`. The backend creates its catalog tables and default categories at startup.
- Admin access is available at `/admin`; visitors are redirected to the password screen. Catalog categories and products created there are stored in PostgreSQL.
- The outlet names, coordinates, and hours are illustrative Kampala examples in `apps/frontend/app/outlets/page.tsx`. Replace them with verified shop details before publishing.
