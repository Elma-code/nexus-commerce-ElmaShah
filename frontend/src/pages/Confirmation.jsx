import { Link, useParams } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { formatPrice } from '../lib/helpers.js'

export default function Confirmation() {
  const { id } = useParams()
  const { orders } = useApp()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <p className="mt-2 text-gray-500">We couldn&rsquo;t find an order with the ID &ldquo;{id}&rdquo;.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 underline">Back to the shop</Link>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-green-700">Thank you! Your order is placed.</h1>
      <p className="mt-1 text-gray-600">Order ID: <strong>{order.id}</strong> · Status: {order.status}</p>
      <ul className="mt-4 flex flex-col gap-1 text-sm">
        {order.items.map((i) => (
          <li key={i.productId} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{formatPrice(i.price * i.qty, 'PKR')}</span></li>
        ))}
      </ul>
      <p className="mt-3 flex justify-between border-t pt-3 font-bold"><span>Total</span><span>{formatPrice(order.total, 'PKR')}</span></p>
      <p className="mt-4 text-sm text-gray-600">Deliver to: {order.customer.name}, {order.customer.address}</p>
      <p className="mt-1 text-xs text-gray-500">Demo order: no payment was taken.</p>
      <Link to="/" className="mt-4 inline-block text-indigo-600 underline">Continue shopping</Link>
    </div>
  )
}