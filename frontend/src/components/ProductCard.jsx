import { Link } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { formatPrice, stockStatus } from '../lib/helpers.js'

export default function ProductCard({ product }) {
  const { currency } = useApp()
  const status = stockStatus(product.stock)
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="aspect-square w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-auto text-lg font-bold text-indigo-700">{formatPrice(product.price, currency)}</p>
        <Link
          to={`/product/${product.id}`}
          className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
        >
          View details
        </Link>
      </div>
    </article>
  )
}