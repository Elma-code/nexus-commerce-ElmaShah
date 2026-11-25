# Testing

## Manual tests 


| # | Test | Expected | Observed | Pass/Fail |
|---|------|----------|----------|-----------|
| 1 | Open `/` | 12 products; Resin Flower Ring shows Out of stock; Satin Scrunchie Trio shows Low stock | yes | pass |
| 2 | Search "pearl" | Only Pearl Drop Earrings | yes | pass |
| 3 | Search "zzzz" | "No products match your search" with Clear filters | yes | pass |
| 4 | Pick category Rings | Only rings | yes | pass |
| 5 | Open `/product/p004` | Button disabled, "Out of stock" | yes | pass |
| 6 | Open `/product/p999` | "Product not found" | yes | pass |
| 7 | Add Satin Scrunchie Trio to cart, increase quantity | Quantity stops at 3 (stock) | yes | pass |
| 8 | Cart total | Matches price x quantity | yes | pass |
| 9 | Remove all items | "Your cart is empty" | yes | pass |
| 10 | Checkout with empty fields | Validation errors, no order created | yes | pass |
| 11 | Checkout with valid fictional details | Confirmation page with order ID (NX-1004 on a fresh browser) | yes | pass |
| 12 | Log in as demo.seller@example.com, open Dashboard | New order listed; Total orders increased | yes | pass |
| 13 | Change status to Shipped, add a note, refresh | Status and note still there | yes | pass |
| 14 | Sign up as seller, list a product with 1 picture | Error: at least 2 pictures | yes | pass |
| 15 | List a product with 2 pictures | Appears in the shop | yes | pass |
| 16 | Sign up as buyer with phone +14155550123 | Prices show in USD | yes | pass |
| 17 | Phone width (about 375px) and desktop (about 1280px) | Usable on both; grid 1 column on phone | yes | pass |
| 18 | Refresh on `/admin` on the live site | Page loads (no 404) | yes | pass |

## Automated checks run by the AI assistant (not a substitute for the above)
While building, the assistant ran 5 simulated-browser tests (jsdom) covering catalog and badges, search and empty state, not-found pages, the full cart -> checkout -> dashboard flow, signup validation, and stock blocking at checkout. All passed in that environment. These ran on React 18 / React Router 6 in a scratch copy, not in the real browser.

## Known limitations
See README.






