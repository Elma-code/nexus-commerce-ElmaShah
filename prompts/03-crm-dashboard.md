# Prompt Log: Merchant CRM dashboard

**Feature:** orders table with status and notes, customer list, summary metrics
**AI tool:** Claude (Anthropic), 23 Nov 2026
**Commit(s):** c055c40

## 1. Problem
The seller needs to see orders, update their status, keep notes, and see summary numbers.

## 2. Prompt exactly as used
Same message as log 02 (the AI built the storefront and CRM parts together):
> i need to finish every thing if the idea i gave is longer then make it short 

## 3. Context supplied
The assignment's CRM requirements: order list with ID, items, customer reference, total and status; status update or notes; at least one summary metric; fictional demo records only.

## 4. Iteration
Decisions by the AI: dashboard at `/admin` for seller accounts; shows all orders (platform shipping view); 3 fictional seed orders so the page is not empty; customers derived from orders; metrics = total orders, pending, revenue (excluding cancelled), customers; status options Pending, Processing, Shipped, Delivered, Cancelled. 

## 5. Implementation trace
`pages/Admin.jsx`, `lib/orders.js`, seed data in `lib/storage.js`. Commit: c055c40.

## 6. Validation
| Test | Expected | Observed | Pass/Fail |
|---|---|---|---|
| Log in as demo.seller@example.com, open Dashboard | Metrics and orders table show | yes | pass |
| Place a new order, then check the Dashboard | New order listed; Total orders went up by 1 | yes | pass |
| Change an order's status to Shipped | Status updates | yes | pass |
| Add a note to an order, then refresh | Status and note still there | yes | pass |
| Open /admin on the live site and refresh | Page loads, no 404 | yes | pass |


**Remaining limitations:** every seller sees all orders; no real authentication.
