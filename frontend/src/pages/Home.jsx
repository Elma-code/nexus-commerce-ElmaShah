import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { useApp } from '../lib/appContext.js'

export default function Home() {
  const { products } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(products.map((p) => p.category))]
  const q = query.trim().toLowerCase()
  const shown = products.filter(
    (p) => (category === 'All' || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
  )

  return (
    <div>
      <section className="mb-8 rounded-2xl bg-indigo-50 p-6 sm:p-10">
        <h1 className="text-2xl font-bold text-indigo-900 sm:text-4xl">Handmade accessories, from makers to you</h1>
        <p className="mt-3 max-w-2xl text-gray-700">
          Independent sellers list their own handmade pieces and set their own prices. NEXUS-COMMERCE
          takes care of shipping and handling only.
        </p>
      </section>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="search">Search products</label>
        <input id="search" type="search" placeholder="Search by name…" value={query}
          onChange={(e) => setQuery(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:max-w-xs" />
        <label className="sr-only" htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {products.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-gray-500">No products have been listed yet.</p>
      ) : shown.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
          <p>No products match your search.</p>
          <button type="button" onClick={() => { setQuery(''); setCategory('All') }} className="mt-2 text-indigo-600 underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}