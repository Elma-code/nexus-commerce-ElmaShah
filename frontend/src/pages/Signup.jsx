import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../lib/appContext.js'
import { isEmail, isIban, isPhone, normalizeIban, normalizePhone, currencyFromPhone } from '../lib/helpers.js'

const empty = { role: 'buyer', name: '', phone: '', email: '', address: '', accountName: '', iban: '' }

export default function Signup() {
  const { signup } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const isSeller = form.role === 'seller'

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name.'
    if (!isPhone(form.phone)) e.phone = 'Use international format with country code, e.g. +923001234567.'
    if (!isEmail(form.email)) e.email = 'Enter a valid email address.'
    if (form.address.trim().length < 8) e.address = 'Enter your full address.'
    if (isSeller) {
      if (form.accountName.trim().length < 2) e.accountName = 'Enter the account holder name.'
      if (!isIban(form.iban)) e.iban = 'Enter a valid-format IBAN (Pakistan IBANs have 24 characters).'
    }
    return e
  }

  function onSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    const user = {
      role: form.role, name: form.name.trim(), phone: normalizePhone(form.phone),
      email: form.email.trim(), address: form.address.trim(),
      ...(isSeller && { bank: { accountName: form.accountName.trim(), iban: normalizeIban(form.iban) } }),
    }
    const result = signup(user)
    if (!result.ok) return setFormError(result.error)
    navigate(isSeller ? '/sell' : '/')
  }

  const field = (id, label, props = {}) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <input id={id} value={form[id]} onChange={set(id)} className="w-full rounded-lg border border-gray-300 px-3 py-2" {...props} />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-2 text-2xl font-bold">Create an account</h1>
      <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
        Demo project: use <strong>fictional details only</strong>. Never enter a real IBAN or bank details.
        Accounts are saved in this browser only and there is no password.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <fieldset className="flex gap-6">
          <legend className="mb-1 text-sm font-medium">I want to</legend>
          <label className="flex items-center gap-2"><input type="radio" name="role" checked={!isSeller} onChange={() => setForm({ ...form, role: 'buyer' })} /> Buy</label>
          <label className="flex items-center gap-2"><input type="radio" name="role" checked={isSeller} onChange={() => setForm({ ...form, role: 'seller' })} /> Sell</label>
        </fieldset>
        {field('name', 'Full name', { autoComplete: 'name' })}
        {field('phone', 'Contact number (with country code)', { placeholder: '+923001234567', inputMode: 'tel' })}
        {isPhone(form.phone) && (
          <p className="-mt-2 text-xs text-gray-500">Prices will be shown in {currencyFromPhone(form.phone)} (approximate demo rates).</p>
        )}
        {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
        {field('address', 'Address', { autoComplete: 'street-address' })}
        {isSeller && (
          <>
            {field('accountName', 'Bank account name')}
            {field('iban', 'IBAN (fictional)', { placeholder: 'PK00FAKE0000000000000000' })}
          </>
        )}
        {formError && <p className="text-sm text-red-600">{formError}</p>}
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700">Sign up</button>
        <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-indigo-600 underline">Log in</Link></p>
      </form>
    </div>
  )
}