import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { isEmail } from '../lib/helpers.js'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function onSubmit(ev) {
    ev.preventDefault()
    if (!isEmail(email)) return setError('Enter a valid email address.')
    const result = login(email)
    if (!result.ok) return setError(result.error)
    navigate('/')
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">Log in</h1>
      <p className="mb-4 text-sm text-gray-600">
        Demo login: enter your signup email (no password). Try the demo seller: <code>demo.seller@example.com</code>
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700">Log in</button>
        <p className="text-sm text-gray-600">No account? <Link to="/signup" className="text-indigo-600 underline">Sign up</Link></p>
      </form>
    </div>
  )
}