import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { formatPrice, isEmail, isPhone, normalizePhone } from '../lib/helpers.js'
import { cartLines, linesTotal } from '../lib/orders.js'

export default function Checkout() {
  const { cart, products, currentUser, placeOrder } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: currentUser?.name ?? '', email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '', address: currentUser?.address ?? '',
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const { lines } = cartLines(cart, products)
  const total = linesTotal(lines)

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <h1 className="text-xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-gray-500">Your cart is empty.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 underline">Browse the shop</Link>
      </div>
    )
  }

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value })

  function onSubmit(ev) {
    ev.preventDefault()
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!isEmail(form.email)) e.email = 'Enter a valid email address.'
    if (!isPhone(form.phone)) e.phone = 'Use international format, e.g. +923001234567.'
    if (form.address.trim().length < 8) e.address = 'Enter your full delivery address.'
    setErrors(e)
    if (Object.keys(e).length) return
    const result = placeOrder({
      name: form.name.trim(), email: form.email.trim(),
      phone: normalizePhone(form.phone), address: form.address.trim(),
    })
    if (!result.ok) return setFormError(result.error)
    navigate(`/order/${result.order.id}`)
  }

  const field = (id, label, props = {}) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <input id={id} value={form[id]} onChange={set(id)} className="w-full rounded-lg border border-gray-300 px-3 py-2" {...props} />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
          Simulated checkout: <strong>no payment is taken</strong> and no card details are collected. Use fictional details.
        </p>
        {field('name', 'Full name')}
        {field('email', 'Email', { type: 'email' })}
        {field('phone', 'Phone (with country code)', { placeholder: '+923001234567' })}
        {field('address', 'Delivery address')}
        {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700">Place order</button>
      </form>
      <aside className="h-fit rounded-lg border bg-white p-4">
        <h2 className="mb-3 font-semibold">Order summary</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex justify-between"><span>{product.name} × {qty}</span><span>{formatPrice(product.price * qty, 'PKR')}</span></li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t pt-3 font-bold"><span>Total (PKR)</span><span>{formatPrice(total, 'PKR')}</span></p>
      </aside>
    </div>
  )
}