import api from './api'

interface AuthResponse {
  message: string
  token?: string
}

export const authService = {
  async login(email: string, password: string) {
    // Convert email to lowercase to avoid case sensitivity issues
    const response = await api.post<AuthResponse>('/api/v1/signin', {
      email: email.toLowerCase(),
      password
    })
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  async signup(Name: string, email: string, password: string) {
    const response = await api.post<AuthResponse>('/api/v1/signup', {
      Name,
      email: email.toLowerCase(),
      password
    })
    return response.data
  }
}