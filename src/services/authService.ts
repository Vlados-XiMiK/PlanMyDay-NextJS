export const registerUser = async (email: string, password: string) => {
  const response = await fetch('http://127.0.0.1:8000/auth/register/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Registration failed')
  }

  return response.json()
}

export const loginUser = async (email: string, password: string) => {
  const response = await fetch('http://127.0.0.1:8000/auth/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}
