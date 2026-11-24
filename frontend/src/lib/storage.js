import seedProducts from '../data/products.json'

const KEYS = {
  products: 'nexus_products',
  users: 'nexus_users',
  session: 'nexus_session',
  cart: 'nexus_cart',
  orders: 'nexus_orders',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false // storage full or blocked
  }
}

// Fictional demo seller who "owns" the products from products.json
export const DEMO_SELLER = {
  id: 'seller_demo',
  role: 'seller',
  name: 'Demo Handmade Studio',
  email: 'demo.seller@example.com',
  phone: '+923001234567',
  address: '12 Sample Street, Wah Cantt, Pakistan',
  bank: { accountName: 'Demo Handmade Studio', iban: 'PK00FAKE0000000000000000' },
}

export function loadProducts() {
  const saved = read(KEYS.products, null)
  if (saved) return saved
  const seeded = seedProducts.map((p) => ({
    id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock,
    description: p.description, images: [p.image], sellerId: DEMO_SELLER.id,
  }))
  write(KEYS.products, seeded)
  return seeded
}
export const saveProducts = (list) => write(KEYS.products, list)

export function loadUsers() {
  const saved = read(KEYS.users, null)
  if (saved) return saved
  write(KEYS.users, [DEMO_SELLER])
  return [DEMO_SELLER]
}
export const saveUsers = (list) => write(KEYS.users, list)

export const loadSession = () => read(KEYS.session, null)
export const saveSession = (id) => write(KEYS.session, id)

export const loadCart = () => read(KEYS.cart, [])
export const saveCart = (items) => write(KEYS.cart, items)

// Fictional demo orders so the merchant dashboard is not empty on first load
const SEED_ORDERS = [
  { id: 'NX-1001', date: '2026-11-10T09:30:00.000Z', status: 'Delivered', notes: 'Delivered, customer happy.',
    customer: { name: 'Ayesha Khan (demo)', email: 'ayesha.demo@example.com', phone: '+923001110001', address: '1 Demo Lane, Islamabad' },
    items: [{ productId: 'p001', name: 'Braided Leather Bracelet', price: 1800, qty: 1 }, { productId: 'p011', name: 'Woven Keychain', price: 800, qty: 2 }], total: 3400 },
  { id: 'NX-1002', date: '2026-11-15T14:10:00.000Z', status: 'Shipped', notes: '',
    customer: { name: 'Bilal Ahmed (demo)', email: 'bilal.demo@example.com', phone: '+923001110002', address: '2 Sample Road, Lahore' },
    items: [{ productId: 'p005', name: 'Pearl Drop Earrings', price: 2500, qty: 1 }], total: 2500 },
  { id: 'NX-1003', date: '2026-11-20T18:45:00.000Z', status: 'Pending', notes: '',
    customer: { name: 'Sara Malik (demo)', email: 'sara.demo@example.com', phone: '+923001110003', address: '3 Test Street, Karachi' },
    items: [{ productId: 'p008', name: 'Initial Charm Necklace', price: 2800, qty: 1 }, { productId: 'p006', name: 'Clay Leaf Earrings', price: 1400, qty: 1 }], total: 4200 },
]

export function loadOrders() {
  const saved = read(KEYS.orders, null)
  if (saved) return saved
  write(KEYS.orders, SEED_ORDERS)
  return SEED_ORDERS
}
export const saveOrders = (list) => write(KEYS.orders, list)