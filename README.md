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

## Security and caching

`frontend/vercel.json` sets the security headers: a Content-Security-Policy (scripts only from this site;
images from the site, Unsplash, Cloudinary and the Render backend; fonts from Google Fonts), plus
clickjacking, MIME-sniffing and permissions protection. Built files in `/assets/` are cached for a year
(their names change on every build); everything else is re-checked.

If the backend moves to a custom domain (e.g. `api.hairxcellence.com`), add that domain to `img-src`
and `connect-src` in `vercel.json`, or API calls and product photos will be blocked.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4
