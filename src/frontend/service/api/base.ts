const API_BASE_URL = 'http://127.0.0.1:5000'

export async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = localStorage.getItem('readflow_token')
  try {
    console.log(`Making request to: ${url}`)

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include',
    })

    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {

    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to backend server. Please make sure the server is running on http://127.0.0.1:5000')
    }

    throw error
  }
}
