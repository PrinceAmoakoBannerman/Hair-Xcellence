# Hair Xcellence

Storefront for **Hair Xcellence** — luxury human hair wigs, bundles and closures, hand-finished in Accra.

## Features

- Homepage with next-drop countdown and early-access signup
- Shop catalogue with search, category, price, texture and availability filters, sorting and quick view
- Product pages with full wig customisation (length, texture, lace type & size, density, colour, cap size, finishing touches) and live pricing
- Cart, checkout (Mobile Money / card UI), customer account and order tracking
- Responsive, mobile-first design

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4

## Getting started

```bash
pnpm install     # or: npm install
pnpm dev         # http://localhost:5173
pnpm build       # production build in dist/
```

Expose the dev server on your local network (to test on a phone):

```bash
pnpm dev --host
```

## Project structure

```
src/
  data.ts        products, pricing rules, images, next drop date
  ui.tsx         shared components (icons, product card, quick view, countdown, popup)
  layout.tsx     announcement bar, header, footer
  pages/         Home, Shop, Product, and cart/checkout/account pages
  index.css      design tokens and styles
public/images/   product and campaign photography
```

## Roadmap

- Django backend and admin for products, orders and customers
- Payment integration
