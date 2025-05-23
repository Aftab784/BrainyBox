import api from './api'

interface SignInResponse {
  message: string
  token: string
}

export const authService = {
  async login(email: string, password: string) {
    // Convert email to lowercase to avoid case sensitivity issues
    const response = await api.post<SignInResponse>('/api/v1/signin', {
      email: email.toLowerCase(),
      password
    })
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  }
}