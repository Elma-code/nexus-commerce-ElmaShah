import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { formatPrice, stockStatus } from '../lib/helpers.js'

export default function ProductDetail() {
  const { id } = useParams()
  const { products, users, currency, addToCart } = useApp()
  const [imgIndex, setImgIndex] = useState(0)
  const [message, setMessage] = useState('')

  const product = products.find((p) => p.id === id)
  if (!product) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-xl font-semibold">Product not found</h1>
        <p className="mt-2 text-gray-500">We couldn&rsquo;t find a product with the ID &ldquo;{id}&rdquo;.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 underline">Back to the shop</Link>
      </div>
    )
  }

  const seller = users.find((u) => u.id === product.sellerId)
  const status = stockStatus(product.stock)
  const soldOut = product.stock <= 0

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <img src={product.images[imgIndex]} alt={product.name} className="aspect-square w-full rounded-xl object-cover" />
        {product.images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {product.images.map((src, i) => (
              <button key={i} type="button" onClick={() => setImgIndex(i)} aria-label={`Show image ${i + 1}`}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === imgIndex ? 'border-indigo-600' : 'border-transparent'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <Link to="/" className="text-sm text-indigo-600 underline">&larr; Back to the shop</Link>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.category}{seller ? ` · Sold by ${seller.name}` : ''}</p>
        <span className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${status.color}`}>
          {status.label}{!soldOut ? ` (${product.stock} available)` : ''}
        </span>
        <p className="text-2xl font-bold text-indigo-700">{formatPrice(product.price, currency)}</p>
        {currency !== 'PKR' && (
          <p className="text-xs text-gray-500">Listed price: {formatPrice(product.price, 'PKR')}. Converted at approximate demo rates.</p>
        )}
        <p className="text-gray-700">{product.description}</p>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => setMessage(addToCart(product.id).message)}
          className="mt-2 rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {soldOut ? 'Out of stock' : 'Add to cart'}
        </button>
        {message && (
          <p role="status" className="text-sm text-green-700">
            {message} <Link to="/cart" className="underline">View cart</Link>
          </p>
        )}
      </div>
    </div>
  )
}