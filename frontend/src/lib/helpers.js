// ---------- Stock badge ----------
export function stockStatus(stock) {
  if (stock <= 0) return { label: 'Out of stock', color: 'bg-red-100 text-red-700' }
  if (stock < 5) return { label: 'Low stock', color: 'bg-amber-100 text-amber-800' }
  return { label: 'In stock', color: 'bg-green-100 text-green-700' }
}

// ---------- Currency (DEMO ONLY: fixed approximate rates, not live) ----------
// Calling code (digits only, no +) -> currency
const CODE_TO_CURRENCY = {
  '92': 'PKR', '1': 'USD', '44': 'GBP', '971': 'AED', '966': 'SAR', '974': 'QAR',
  '965': 'KWD', '91': 'INR', '61': 'AUD', '49': 'EUR', '33': 'EUR', '39': 'EUR',
  '34': 'EUR', '90': 'TRY', '60': 'MYR', '86': 'CNY', '81': 'JPY',
}
// Approximate units of each currency per 1 PKR. Prices are PKR by default.
const RATES_PER_PKR = {
  PKR: 1, USD: 0.0036, GBP: 0.0027, EUR: 0.0031, AED: 0.0132, SAR: 0.0135, QAR: 0.0131,
  KWD: 0.0011, INR: 0.30, AUD: 0.0055, TRY: 0.15, MYR: 0.015, CNY: 0.026, JPY: 0.55,
}

export function currencyFromPhone(phone = '') {
  const digits = phone.replace(/\D/g, '')
  for (const len of [3, 2, 1]) {
    const match = CODE_TO_CURRENCY[digits.slice(0, len)]
    if (match) return match
  }
  return 'PKR'
}

export function formatPrice(pricePkr, currency = 'PKR') {
  const rate = RATES_PER_PKR[currency] ?? 1
  const code = RATES_PER_PKR[currency] ? currency : 'PKR'
  const noDecimals = code === 'PKR' || code === 'JPY'
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  }).format(pricePkr * rate)
}

// ---------- Validation ----------
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
export const normalizePhone = (v) => v.replace(/[\s-]/g, '')
export const isPhone = (v) => /^\+\d{8,15}$/.test(normalizePhone(v))
export const normalizeIban = (v) => v.replace(/\s/g, '').toUpperCase()
export function isIban(v) {
  const s = normalizeIban(v)
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false
  if (s.startsWith('PK')) return s.length === 24
  return true
}

// ---------- Image upload: shrink so it fits in localStorage ----------
export function fileToDataUrl(file, maxSize = 600, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error(`${file.name} is not a valid image`))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}