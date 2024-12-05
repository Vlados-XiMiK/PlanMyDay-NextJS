import { format } from 'date-fns'
import { refreshAccessToken } from '@/services/authenticateService'

export async function getProfile() {
  try {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      throw new Error('No access token')
    }

    const response = await fetch('http://127.0.0.1:8000/auth/profile/prf/', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      return response.json()
    }

    if (response.status === 401) {
      await refreshAccessToken()
      return getProfile()
    }

    throw new Error('Failed to fetch profile')
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching profile')
  }
}

export function formatDate(date: Date | string): string {
  if (!date) return 'N/A'
  const parsedDate = new Date(date)
  return format(parsedDate, 'MMM dd, yyyy hh:mm a')
}
