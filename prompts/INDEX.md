# Prompt documentation index

AI assistant used: Claude (Anthropic). These logs contain the prompts I actually sent, copied exactly.

| Section | Prompt log | Main source files |
|---|---|---|
| Storefront, signup, seller listings, currency | [01-storefront-marketplace.md](01-storefront-marketplace.md) | `frontend/src/pages/Home.jsx`, `ProductDetail.jsx`, `Signup.jsx`, `Login.jsx`, `SellerDashboard.jsx`, `components/ProductCard.jsx`, `lib/helpers.js`, `lib/storage.js` |
| Cart, checkout, orders, search | [02-cart-checkout-orders.md](02-cart-checkout-orders.md) | `pages/Cart.jsx`, `Checkout.jsx`, `Confirmation.jsx`, `Home.jsx`, `lib/orders.js`, `AppProvider.jsx` |
| Merchant CRM dashboard | [03-crm-dashboard.md](03-crm-dashboard.md) | `pages/Admin.jsx`, `lib/orders.js` |
| Bug fixes | [04-debugging-and-iterations.md](04-debugging-and-iterations.md) | (fill in) |

Context engineering example: see "Context supplied" and "Validation" in 01-storefront-marketplace.md (`products.json` and `constraints.md` given to the AI, then checked against the real app).