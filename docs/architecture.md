# Architecture

Single-page React app (Vite) with React Router. No backend; state lives in React context and is mirrored to localStorage.

## Pages
`/` shop · `/product/:id` detail · `/cart` · `/checkout` · `/order/:id` confirmation · `/signup` · `/login` · `/sell` seller listings · `/admin` merchant dashboard · `*` not found

## Code layout (frontend/src)
- `AppProvider.jsx`: shared state and actions (accounts, products, cart, orders).
- `lib/storage.js`: localStorage read/write and seed data. `lib/orders.js`: pure order, stock and summary logic. `lib/helpers.js`: stock badge, currency, validation, image resize.
- `components/ProductCard.jsx`, `pages/*.jsx`.
- `data/products.json`: the 12 fictional starter products (context supplied to the AI).

## localStorage keys
`nexus_products`, `nexus_users`, `nexus_session`, `nexus_cart`, `nexus_orders`

## Order flow
cart items -> checkout form validation -> stock re-check -> order saved (status Pending, stock reduced, cart cleared) -> visible in `/admin`, where status and notes can be changed.