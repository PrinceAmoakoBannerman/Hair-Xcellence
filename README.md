# Hair Xcellence — Website

Storefront for **Hair Xcellence**: luxury human hair wigs, bundles and closures, hand-finished in Accra.
The website lives in `frontend/` and is deployed on Vercel. The backend (Django admin + API) is a separate
repository, **Hair-Xcellence-backend**, deployed on Render.

## Run locally

```bat
cd frontend
npm install
npm run dev
```

Opens on http://localhost:5173. Run the backend at the same time (see its README); the website looks for it
on port 8001 of the same machine.

## How it connects to the backend

- Products come from the backend (`/api/products/`). Prices, sales, stock, photos, new and hidden products set
  in the Django admin show on the site. If the backend can't be reached, the site uses its last-known list.
- Checkout sends orders to the backend (`/api/orders/`); prices are recalculated there.
- Customer accounts (sign up, sign in, order history, saved details) use `/api/auth/…`.

## Deploy (Vercel)

- **Root Directory:** `frontend` · Framework preset: Vite
- **Environment variable:** `VITE_API_URL` = the backend's Render URL, e.g. `https://hairxcellence-api.onrender.com`

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4
