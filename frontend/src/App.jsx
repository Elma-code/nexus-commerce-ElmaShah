import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useApp } from './lib/appContext.js'
import Home from './pages/Home.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Admin from './pages/Admin.jsx'

function NotFound() {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-indigo-600 underline">Back to the shop</Link>
    </div>
  )
}

export default function App() {
  const { currentUser, currency, cartCount, logout } = useApp()
  const link = ({ isActive }) => (isActive ? 'font-semibold text-indigo-700' : 'text-gray-600 hover:text-indigo-700')
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/" className="text-lg font-bold text-indigo-700">NEXUS-COMMERCE</Link>
          <NavLink to="/" end className={link}>Shop</NavLink>
          <NavLink to="/cart" className={link}>Cart ({cartCount})</NavLink>
          {currentUser?.role === 'seller' && <NavLink to="/sell" className={link}>Sell</NavLink>}
          {currentUser?.role === 'seller' && <NavLink to="/admin" className={link}>Dashboard</NavLink>}
          <div className="ml-auto flex items-center gap-4 text-sm">
            {currentUser ? (
              <>
                <span className="text-gray-600">Hi, {currentUser.name.split(' ')[0]} ({currency})</span>
                <button type="button" onClick={logout} className="text-indigo-600 underline">Log out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={link}>Log in</NavLink>
                <NavLink to="/signup" className={link}>Sign up</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sell" element={<SellerDashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Confirmation />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t bg-white px-4 py-4 text-center text-xs text-gray-500">
        Demo project with fictional data. Prices are in PKR by default; other currencies use fixed approximate rates, not live rates.
      </footer>
    </div>
  )
}