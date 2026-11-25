# Testing

## Manual tests (fill in YOUR real results before submitting)
Run each test yourself on the deployed site or locally. Write what you actually saw. Do not copy the "Expected" column into "Observed" unless it is true.

| # | Test | Expected | Observed | Pass/Fail |
|---|------|----------|----------|-----------|
| 1 | Open `/` | 12 products; Resin Flower Ring shows Out of stock; Satin Scrunchie Trio shows Low stock | | |
| 2 | Search "pearl" | Only Pearl Drop Earrings | | |
| 3 | Search "zzzz" | "No products match your search" with Clear filters | | |
| 4 | Pick category Rings | Only rings | | |
| 5 | Open `/product/p004` | Button disabled, "Out of stock" | | |
| 6 | Open `/product/p999` | "Product not found" | | |
| 7 | Add Satin Scrunchie Trio to cart, increase quantity | Quantity stops at 3 (stock) | | |
| 8 | Cart total | Matches price x quantity | | |
| 9 | Remove all items | "Your cart is empty" | | |
| 10 | Checkout with empty fields | Validation errors, no order created | | |
| 11 | Checkout with valid fictional details | Confirmation page with order ID (NX-1004 on a fresh browser) | | |
| 12 | Log in as demo.seller@example.com, open Dashboard | New order listed; Total orders increased | | |
| 13 | Change status to Shipped, add a note, refresh | Status and note still there | | |
| 14 | Sign up as seller, list a product with 1 picture | Error: at least 2 pictures | | |
| 15 | List a product with 2 pictures | Appears in the shop | | |
| 16 | Sign up as buyer with phone +14155550123 | Prices show in USD | | |
| 17 | Phone width (about 375px) and desktop (about 1280px) | Usable on both; grid 1 column on phone | | |
| 18 | Refresh on `/admin` on the live site | Page loads (no 404) | | |

## Automated checks run by the AI assistant (not a substitute for the above)
While building, the assistant ran 5 simulated-browser tests (jsdom) covering catalog and badges, search and empty state, not-found pages, the full cart -> checkout -> dashboard flow, signup validation, and stock blocking at checkout. All passed in that environment. These ran on React 18 / React Router 6 in a scratch copy, not in the real browser.

## Known limitations
See README.