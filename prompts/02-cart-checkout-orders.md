# Prompt Log: Cart, checkout, orders, search and filter

**Feature:** name search, category filter, cart, simulated checkout, order confirmation
**AI tool:** Claude (Anthropic), 23 Nov 2026
**Commit(s):** c055c40

## 1. Problem
The assignment requires search/filter, a cart with a total, and a simulated checkout that creates an order.

## 2. Prompt exactly as used
> i need to finish every thing if the idea i give is longer then make it short 

Follow-up I sent:
> wait wont that make it incompelete?


## 3. Context supplied
The earlier conversation, the assignment PDF, the existing code from log 01, and the assignment's required-feature list.

## 4. Iteration
The AI reduced my idea to the assignment's required features (dropped an inquiries feature, live exchange rates, passwords, buyer order history) and explained that each cut was optional. Decisions made by the AI: guest checkout; orders recorded in PKR; stock reduced at checkout; stock re-checked at checkout; quantity capped at stock; order IDs like NX-1004. 

## 5. Implementation trace
`Cart.jsx`, `Checkout.jsx`, `Confirmation.jsx`, `Home.jsx` (search/filter), `lib/orders.js`, `AppProvider.jsx`. Commit: c055c40. Manual edits: nothing.

## 6. Validation
| Test | Expected | Observed | Pass/Fail |
|---|---|---|---|
| Search "pearl" | Only Pearl Drop Earrings | | |
| Search "zzzz" | "No products match your search" | | |
| Choose the Rings category | Only rings | | |
| Add Satin Scrunchie Trio and keep clicking + | Quantity stops at 3 | | |
| Remove all items from the cart | "Your cart is empty" | | |
| Place an order with empty fields | Validation errors, no order | | |
| Place an order with valid fictional details | Confirmation page with an order ID | | |
| Open /order/NX-9999 | "Order not found" page | | |

**Remaining limitations:** orders live in this browser only; payment is simulated.