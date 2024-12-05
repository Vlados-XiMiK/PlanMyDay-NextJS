export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  const response = await fetch('http://127.0.0.1:8000/auth/token/refresh/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const data = await response.json()
  localStorage.setItem('accessToken', data.access) // Обновляем access token
  return data.access
}

export async function isAuthenticated() {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    return false
  }

  const response = await fetch('http://127.0.0.1:8000/auth/profile/prf/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.ok) {
    return true
  }

  if (response.status === 401) {
    // Попытка обновить токен
    try {
      await refreshAccessToken()
      return true
    } catch {
      return false
    }
  }

  return false
}
