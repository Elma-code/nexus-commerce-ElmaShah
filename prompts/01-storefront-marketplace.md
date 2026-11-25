# Prompt Log: Storefront, signup, seller listings, currency

**Feature:** product grid with stock badge, product detail, buyer/seller signup, seller product upload, phone-based currency
**AI tool:** Claude (Anthropic), 23 Nov 2026
**Commit(s):** c055c40

## 1. Problem
Buyers need to browse handmade products; sellers need to list their own products and sign up.

## 2. Prompt exactly as used
> i want an online store using the attached products.json and constraints.md, build the storefront for a handmade accessories shop in React + Vite + Tailwind CSS v3. where different sellers upload their handmade products and the website itself deals only with the shipping and handling of the product the prices and client handling are to be handled by the sellers themselves. atleast two pictures of the product to be sold are to be required for uploading by the seller with a product description. both seller and user have to create ids/accounts (a signup) the common data being their name, contact no., addresses and emails, and an additional requirement of bank transfer details(account name and IBAN) if the user is signing up as a seller. the default price setting would be in pkr but can be converted to the users country currency using the country code in the phone no. they provided when creating their account. Create a responsive product grid showing image, name, price , and an availability badge (In stock / Low stock if under 5 / Out of stock). Add a product detail page at /product/:id with a 'product not found' state. Use React Router. Do not invent products or add payments. Acceptance criteria: grid is 1 column on mobile and 3 or 4 on desktop; out-of-stock items have a disabled button. Return the full code of each file and tell me where to put it.


## 3. Context supplied
- frontend/src/data/products.json: 12 fictional products. The dataset was drafted by Claude at my request (I gave only the niche, "handmade accessories"); I then used it as context for the build prompt. Image links are placehold.co placeholders, not real product photos.
- docs/constraints.md (stack, no payments, pages, edge cases, responsive widths).

## 4. Iteration
- Decisions the AI made that my prompt did not specify: a stock field on the seller form (needed for badges); no passwords (email-only demo login); fixed approximate exchange rates for about 14 currencies; uploaded images resized and kept in localStorage; the 12 starter products belong to a fictional demo seller; I was warned to use a fake IBAN.

- Decisions the AI made that my prompt did not specify: a stock field on the seller form (needed for the availability badge), a limit of 2 to 4 pictures, email-only login with no passwords, fixed approximate exchange rates for about 14 currencies (not live; unknown country codes fall back to PKR; logged-out visitors see PKR), uploaded images shrunk and saved in browser localStorage, the 12 starter products assigned to a fictional demo seller, and a warning to use a fictional IBAN.
Not covered by this prompt: search, cart, checkout, orders and the merchant dashboard (see logs 02 and 03).
Limitations: bank details are stored in plain text in the browser and not used; the IBAN check is format-only; sellers cannot edit or delete products.
No revision prompt was sent for this feature. Setup problems I hit while running it are recorded in 04-debugging-and-iterations.md.

## 5. Implementation trace
Files: see INDEX.md. Commit: c055c40.
What I changed manually: nothing.

## 6. Validation
Context-engineering check: AI compared the shop page against products.json.  Limitation: the dataset itself was AI-drafted, so this check shows the app follows the supplied data, not that the data is real.

| Test | Expected | Observed | Pass/Fail |
|---|---|---|---|
| Open the home page | 12 product cards; Resin Flower Ring shows Out of stock; Satin Scrunchie Trio shows Low stock | yes | pass |
| Open /product/p004 | Button is greyed out and disabled | yes | pass |
| Open /product/p999 | "Product not found" page | yes image also available in readme | pass |
| Sign up as a buyer with an invalid phone (no +) | Error message under the phone field | "Use international format, e.g. +923001234567", displayed | pass |
| Sign up as a buyer with +14155550123 | Prices shown in USD | yes | pass |
| Choose Sell on signup, leave bank fields empty | Errors for account name and IBAN | yes | pass |
| List a product with only 1 picture | Error: upload at least 2 pictures | yes | pass |
| List a product with 2 pictures | Product appears in the shop | yes | pass |
| Resize to phone width, then desktop width | 1 column on phone, 4 on a wide screen | yes | pass |
| Refresh the page after signing in | Still signed in | yes | pass |

**Remaining limitations:** demo currency rates; no real login; data only in this browser.
