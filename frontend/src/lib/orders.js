export const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

// Turn cart items into lines with the full product; report items whose product no longer exists
export function cartLines(cart, products) {
  const lines = []
  const missing = []
  for (const item of cart) {
    const product = products.find((p) => p.id === item.productId)
    if (product) lines.push({ product, qty: item.qty })
    else missing.push(item.productId)
  }
  return { lines, missing }
}

export const linesTotal = (lines) => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0)

export function stockProblems(lines) {
  const problems = []
  for (const { product, qty } of lines) {
    if (product.stock <= 0) problems.push(`${product.name} is out of stock.`)
    else if (qty > product.stock) problems.push(`Only ${product.stock} of ${product.name} available (you have ${qty}).`)
  }
  return problems
}

export function nextOrderId(orders) {
  const nums = orders.map((o) => Number(String(o.id).replace('NX-', ''))).filter(Number.isFinite)
  return `NX-${(nums.length ? Math.max(...nums) : 1000) + 1}`
}

export function buildOrder(orders, lines, customer) {
  return {
    id: nextOrderId(orders),
    date: new Date().toISOString(),
    customer,
    items: lines.map(({ product, qty }) => ({ productId: product.id, name: product.name, price: product.price, qty })),
    total: linesTotal(lines),
    status: 'Pending',
    notes: '',
  }
}

export function applyStock(products, lines) {
  return products.map((p) => {
    const line = lines.find((l) => l.product.id === p.id)
    return line ? { ...p, stock: p.stock - line.qty } : p
  })
}

export function groupCustomers(orders) {
  const map = new Map()
  for (const o of orders) {
    const key = o.customer.email.toLowerCase()
    const c = map.get(key) || { ...o.customer, orders: 0, spent: 0 }
    c.orders += 1
    if (o.status !== 'Cancelled') c.spent += o.total
    map.set(key, c)
  }
  return [...map.values()]
}

export function summarize(orders) {
  return {
    totalOrders: orders.length,
    pending: orders.filter((o) => o.status === 'Pending').length,
    revenue: orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0),
    customers: groupCustomers(orders).length,
  }
}