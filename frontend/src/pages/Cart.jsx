import { Link } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { formatPrice } from '../lib/helpers.js'
import { cartLines, linesTotal } from '../lib/orders.js'

export default function Cart() {
  const { cart, products, currency, setQty, removeFromCart } = useApp()
  const { lines, missing } = cartLines(cart, products)
  const total = linesTotal(lines)

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        {missing.length > 0 && <p className="mt-2 text-sm text-amber-700">Some items in your cart are no longer available.</p>}
        <Link to="/" className="mt-4 inline-block text-indigo-600 underline">Browse the shop</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Your cart</h1>
      {missing.length > 0 && <p className="mb-3 text-sm text-amber-700">Some items are no longer available and were skipped.</p>}
      <ul className="flex flex-col gap-3">
        {lines.map(({ product, qty }) => (
          <li key={product.id} className="flex flex-wrap items-center gap-4 rounded-lg border bg-white p-3">
            <img src={product.images[0]} alt="" className="h-16 w-16 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <Link to={`/product/${product.id}`} className="font-medium hover:underline">{product.name}</Link>
              <p className="text-sm text-gray-500">{formatPrice(product.price, currency)} each</p>
              {qty > product.stock && <p className="text-sm text-red-600">Only {product.stock} in stock. Please reduce the quantity.</p>}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={`Decrease ${product.name}`} onClick={() => setQty(product.id, qty - 1)} className="h-8 w-8 rounded border">&minus;</button>
              <span className="w-6 text-center" aria-live="polite">{qty}</span>
              <button type="button" aria-label={`Increase ${product.name}`} onClick={() => setQty(product.id, qty + 1)} disabled={qty >= product.stock} className="h-8 w-8 rounded border disabled:opacity-40">+</button>
            </div>
            <p className="w-28 text-right font-semibold">{formatPrice(product.price * qty, currency)}</p>
            <button type="button" onClick={() => removeFromCart(product.id)} className="text-sm text-red-600 underline">Remove</button>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-col items-end gap-2">
        <p className="text-xl font-bold">Total: {formatPrice(total, currency)}</p>
        {currency !== 'PKR' && <p className="text-xs text-gray-500">Orders are recorded in PKR: {formatPrice(total, 'PKR')}</p>}
        <Link to="/checkout" className="rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">Proceed to checkout</Link>
      </div>
    </div>
  )
}