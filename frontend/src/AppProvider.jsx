import { useState } from 'react'
import { AppContext } from './lib/appContext.js'
import {
  loadProducts, saveProducts, loadUsers, saveUsers, loadSession, saveSession,
  loadCart, saveCart, loadOrders, saveOrders,
} from './lib/storage.js'
import { currencyFromPhone } from './lib/helpers.js'
import { applyStock, buildOrder, cartLines, stockProblems } from './lib/orders.js'

export default function AppProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)
  const [users, setUsers] = useState(loadUsers)
  const [sessionId, setSessionId] = useState(loadSession)
  const [cart, setCart] = useState(loadCart)
  const [orders, setOrders] = useState(loadOrders)

  const currentUser = users.find((u) => u.id === sessionId) || null
  const currency = currentUser ? currencyFromPhone(currentUser.phone) : 'PKR'
  const cartCount = cart.reduce((n, l) => n + l.qty, 0)

  // ---------- accounts ----------
  function signup(data) {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const user = { ...data, id: `u_${Date.now()}` }
    const next = [...users, user]
    if (!saveUsers(next)) return { ok: false, error: 'Could not save (browser storage is full or blocked).' }
    saveSession(user.id)
    setUsers(next)
    setSessionId(user.id)
    return { ok: true }
  }
  function login(email) {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user) return { ok: false, error: 'No account found with that email.' }
    saveSession(user.id)
    setSessionId(user.id)
    return { ok: true }
  }
  function logout() {
    saveSession(null)
    setSessionId(null)
  }

  // ---------- products ----------
  function addProduct(product) {
    const next = [...products, { ...product, id: `u${Date.now()}`, sellerId: currentUser.id }]
    if (!saveProducts(next)) return false
    setProducts(next)
    return true
  }

  // ---------- cart ----------
  function updateCart(next) {
    saveCart(next)
    setCart(next)
  }
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId)
    if (!product || product.stock <= 0) return { ok: false, message: 'This product is out of stock.' }
    const line = cart.find((l) => l.productId === productId)
    if (line && line.qty >= product.stock) return { ok: false, message: 'You already have all available stock in your cart.' }
    updateCart(line ? cart.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l)) : [...cart, { productId, qty: 1 }])
    return { ok: true, message: 'Added to cart.' }
  }
  function setQty(productId, qty) {
    const product = products.find((p) => p.id === productId)
    const max = product ? product.stock : 1
    if (qty < 1) return removeFromCart(productId)
    updateCart(cart.map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, max) } : l)))
  }
  function removeFromCart(productId) {
    updateCart(cart.filter((l) => l.productId !== productId))
  }

  // ---------- orders ----------
  function placeOrder(customer) {
    const { lines, missing } = cartLines(cart, products)
    if (lines.length === 0) return { ok: false, error: 'Your cart is empty.' }
    const problems = stockProblems(lines)
    if (missing.length) problems.push('Some items are no longer available.')
    if (problems.length) return { ok: false, error: problems.join(' ') }
    const order = buildOrder(orders, lines, customer)
    const nextOrders = [order, ...orders]
    const nextProducts = applyStock(products, lines)
    if (!saveOrders(nextOrders) || !saveProducts(nextProducts)) {
      return { ok: false, error: 'Could not save the order (browser storage is full or blocked).' }
    }
    updateCart([])
    setOrders(nextOrders)
    setProducts(nextProducts)
    return { ok: true, order }
  }
  function updateOrder(id, patch) {
    const next = orders.map((o) => (o.id === id ? { ...o, ...patch } : o))
    saveOrders(next)
    setOrders(next)
  }

  const value = {
    products, users, currentUser, currency, cart, cartCount, orders,
    signup, login, logout, addProduct, addToCart, setQty, removeFromCart, placeOrder, updateOrder,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}