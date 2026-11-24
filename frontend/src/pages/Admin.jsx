import { Link } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { formatPrice } from '../lib/helpers.js'
import { STATUSES, groupCustomers, summarize } from '../lib/orders.js'

export default function Admin() {
  const { currentUser, orders, updateOrder } = useApp()

  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center">
        The merchant dashboard is for seller accounts. <Link to="/login" className="text-indigo-600 underline">Log in</Link> (demo seller: demo.seller@example.com).
      </p>
    )
  }

  const stats = summarize(orders)
  const customers = groupCustomers(orders)
  const cards = [
    ['Total orders', stats.totalOrders], ['Pending orders', stats.pending],
    ['Revenue (excl. cancelled)', formatPrice(stats.revenue, 'PKR')], ['Customers', stats.customers],
  ]

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">Merchant dashboard</h1>
        <p className="text-sm text-gray-600">Demo data only. All customers and orders are fictional.</p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Summary">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-indigo-700">{value}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Orders</h2>
        {orders.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr><th className="p-3">Order</th><th className="p-3">Items</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Notes</th></tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t align-top">
                    <td className="p-3 font-medium">{o.id}<p className="text-xs font-normal text-gray-500">{new Date(o.date).toLocaleDateString()}</p></td>
                    <td className="p-3">{o.items.map((i) => <p key={i.productId}>{i.name} × {i.qty}</p>)}</td>
                    <td className="p-3">{o.customer.name}<p className="text-xs text-gray-500">{o.customer.email}</p></td>
                    <td className="p-3">{formatPrice(o.total, 'PKR')}</td>
                    <td className="p-3">
                      <label className="sr-only" htmlFor={`st-${o.id}`}>Status for {o.id}</label>
                      <select id={`st-${o.id}`} value={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value })} className="rounded border border-gray-300 px-2 py-1">
                        {STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <label className="sr-only" htmlFor={`nt-${o.id}`}>Notes for {o.id}</label>
                      <textarea id={`nt-${o.id}`} rows={2} defaultValue={o.notes} placeholder="Add a note…" onBlur={(e) => e.target.value !== o.notes && updateOrder(o.id, { notes: e.target.value })} className="w-full min-w-[160px] rounded border border-gray-300 px-2 py-1" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Customers</h2>
        {customers.length === 0 ? (
          <p className="rounded-lg border border-dashed p-6 text-center text-gray-500">No customers yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <div key={c.email} className="rounded-lg border bg-white p-4 text-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="text-gray-500">{c.email} · {c.phone}</p>
                <p className="mt-1 text-gray-500">{c.address}</p>
                <p className="mt-2">{c.orders} order(s) · {formatPrice(c.spent, 'PKR')}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}