import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { fileToDataUrl, formatPrice, stockStatus } from '../lib/helpers.js'

const emptyForm = { name: '', price: '', stock: '', category: '', description: '' }

export default function SellerDashboard() {
  const { currentUser, products, addProduct } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  if (!currentUser) {
    return <p className="rounded-lg border border-dashed p-8 text-center">Please <Link to="/login" className="text-indigo-600 underline">log in</Link> or <Link to="/signup" className="text-indigo-600 underline">sign up</Link> as a seller to list products.</p>
  }
  if (currentUser.role !== 'seller') {
    return <p className="rounded-lg border border-dashed p-8 text-center">Only seller accounts can list products. <Link to="/signup" className="text-indigo-600 underline">Create a seller account</Link>.</p>
  }

  const mine = products.filter((p) => p.sellerId === currentUser.id)
  const categories = [...new Set([...products.map((p) => p.category), 'Other'])]
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter a product name.'
    if (!(Number(form.price) > 0)) e.price = 'Enter a price greater than 0 (in PKR).'
    if (!/^\d+$/.test(form.stock)) e.stock = 'Enter the stock as a whole number (0 or more).'
    if (!form.category) e.category = 'Choose a category.'
    if (form.description.trim().length < 10) e.description = 'Write a description (at least 10 characters).'
    if (files.length < 2) e.images = 'Upload at least 2 pictures.'
    else if (files.length > 4) e.images = 'Upload at most 4 pictures.'
    return e
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    setStatus('')
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    setBusy(true)
    try {
      const images = await Promise.all(files.map((f) => fileToDataUrl(f)))
      const ok = addProduct({
        name: form.name.trim(), price: Number(form.price), stock: Number(form.stock),
        category: form.category, description: form.description.trim(), images,
      })
      if (!ok) return setStatus('error:Could not save. Browser storage is full; try smaller or fewer images.')
      setForm(emptyForm)
      setFiles([])
      ev.target.reset()
      setStatus('ok:Product listed. It now appears in the shop.')
    } catch (err) {
      setStatus(`error:${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  const input = 'w-full rounded-lg border border-gray-300 px-3 py-2'
  const err = (k) => errors[k] && <p className="mt-1 text-sm text-red-600">{errors[k]}</p>

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section>
        <h1 className="mb-1 text-2xl font-bold">Seller dashboard</h1>
        <p className="mb-4 text-sm text-gray-600">Signed in as {currentUser.name}. You set your own price and handle your own customers; we handle shipping.</p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <div><label htmlFor="name" className="mb-1 block text-sm font-medium">Product name</label><input id="name" value={form.name} onChange={set('name')} className={input} />{err('name')}</div>
          <div className="grid grid-cols-2 gap-4">
            <div><label htmlFor="price" className="mb-1 block text-sm font-medium">Price (PKR)</label><input id="price" inputMode="decimal" value={form.price} onChange={set('price')} className={input} />{err('price')}</div>
            <div><label htmlFor="stock" className="mb-1 block text-sm font-medium">Stock</label><input id="stock" inputMode="numeric" value={form.stock} onChange={set('stock')} className={input} />{err('stock')}</div>
          </div>
          <div><label htmlFor="category" className="mb-1 block text-sm font-medium">Category</label>
            <select id="category" value={form.category} onChange={set('category')} className={input}>
              <option value="">Choose&hellip;</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>{err('category')}</div>
          <div><label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label><textarea id="description" rows={4} value={form.description} onChange={set('description')} className={input} />{err('description')}</div>
          <div><label htmlFor="images" className="mb-1 block text-sm font-medium">Pictures (2 to 4 required)</label>
            <input id="images" type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} />
            {files.length > 0 && <p className="mt-1 text-xs text-gray-500">{files.length} selected</p>}{err('images')}</div>
          {status && <p role="status" className={`text-sm ${status.startsWith('ok:') ? 'text-green-700' : 'text-red-600'}`}>{status.slice(status.indexOf(':') + 1)}</p>}
          <button type="submit" disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:bg-gray-300">{busy ? 'Saving…' : 'List product'}</button>
        </form>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Your listings ({mine.length})</h2>
        {mine.length === 0 ? <p className="rounded-lg border border-dashed p-6 text-center text-gray-500">You haven&rsquo;t listed anything yet.</p> : (
          <ul className="flex flex-col gap-3">
            {mine.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg border bg-white p-3">
                <img src={p.images[0]} alt="" className="h-14 w-14 rounded object-cover" />
                <div className="flex-1"><Link to={`/product/${p.id}`} className="font-medium hover:underline">{p.name}</Link>
                  <p className="text-sm text-gray-500">{formatPrice(p.price, 'PKR')} · {stockStatus(p.stock).label} ({p.stock})</p></div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}