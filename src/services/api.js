// All talking to the backend happens here.
const BASE = '/api'

let token = sessionStorage.getItem('aurum_token') || ''
export const getToken = () => token
export const setToken = (t) => {
  token = t || ''
  if (t) sessionStorage.setItem('aurum_token', t)
  else sessionStorage.removeItem('aurum_token')
}

async function request(path, { method = 'GET', body, auth = false, form } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: form || (body ? JSON.stringify(body) : undefined),
    })
  } catch {
    throw new Error('Cannot reach the server. Is it running on port 5000?')
  }

  let data = null
  try { data = await res.json() } catch { /* no body */ }

  if (!res.ok) {
    if (res.status === 401 && auth) setToken('') // login expired
    throw new Error((data && data.error) || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  // menu
  getMenu: () => request('/menu'),
  addDish: (d) => request('/menu', { method: 'POST', body: d, auth: true }),
  updateDish: (id, d) => request(`/menu/${id}`, { method: 'PUT', body: d, auth: true }),
  deleteDish: (id) => request(`/menu/${id}`, { method: 'DELETE', auth: true }),

  // orders
  createOrder: (b) => request('/orders', { method: 'POST', body: b }),
  getOrders: () => request('/orders', { auth: true }),
  setOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE', auth: true }),

  // reservations
  createReservation: (b) => request('/reservations', { method: 'POST', body: b }),
  getReservations: () => request('/reservations', { auth: true }),
  setReservationStatus: (id, status) => request(`/reservations/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE', auth: true }),

  // messages
  sendMessage: (b) => request('/messages', { method: 'POST', body: b }),
  getMessages: () => request('/messages', { auth: true }),
  deleteMessage: (id) => request(`/messages/${id}`, { method: 'DELETE', auth: true }),

  // admin
  login: (pin) => request('/admin/login', { method: 'POST', body: { pin } }),
  logout: () => request('/admin/logout', { method: 'POST', auth: true }),
  uploadPhoto: (file) => {
    const form = new FormData()
    form.append('photo', file)
    return request('/upload', { method: 'POST', form, auth: true })
  },
}