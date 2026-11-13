# Hair Xcellence

Storefront and backend for **Hair Xcellence**: luxury human hair wigs, bundles and closures, hand-finished in Accra.

```
HAIR XCELLENCE/
├── frontend/     React + TypeScript + Vite site      → deployed on Vercel
├── backend/      Django + Django REST Framework API  → deployed on Render
└── render.yaml   Render blueprint for the backend
```

## Run locally (two terminals)

### Terminal 1: frontend

```bat
cd frontend
npm install
npm run dev
```

Opens on http://localhost:5173. Add `-- --host` to `npm run dev` to test on your phone over Wi-Fi.

### Terminal 2: backend

First time only:

```bat
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py seed_products
python manage.py createsuperuser
```

Every time after that:

```bat
cd backend
.venv\Scripts\activate
python manage.py runserver 8001
```

- API: http://127.0.0.1:8001/api/products/
- Admin: http://127.0.0.1:8001/admin/

Port 8001 is used so it doesn't clash with other Django projects on the default port 8000.

Run the tests with `python manage.py test`.

## API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health/` | Health check |
| GET | `/api/products/` | All active products. Filters: `?category=Glueless%20Wigs`, `?kind=wig` |
| GET | `/api/products/<slug>/` | One product |
| POST | `/api/orders/` | Place an order. Prices are recalculated on the server from the chosen options |

Option prices live in `backend/catalog/pricing.py` and must match `frontend/src/data.ts`.

## Deploy

**Frontend (Vercel):** project settings → Build & Deployment → **Root Directory: `frontend`**. Framework preset: Vite.

**Backend (Render):** New + → Blueprint → choose this repository. `render.yaml` creates the web service (root `backend/`) and a Postgres database. After the first deploy:

1. In the service's environment, set `CORS_ALLOWED_ORIGINS` to your Vercel URL and `CSRF_TRUSTED_ORIGINS` to your Render URL.
2. Open the service's **Shell** and run `python manage.py createsuperuser` and `python manage.py seed_products`.

No secrets are stored in the repository. Local settings go in `backend/.env` (ignored by git); production values are set in Render.

## Roadmap

- Connect the frontend to the API (products and orders)
- Paystack payments (MoMo and card)
- Order confirmation emails and WhatsApp/SMS updates
