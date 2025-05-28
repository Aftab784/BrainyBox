import api from './api'

interface AuthResponse {
  message: string
  token?: string
}

interface SignupRequest {
  Name: string;
  email: string;
  password: string;
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

  async signup(Name: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const payload: SignupRequest = {
        Name,
        email: email.toLowerCase(),
        password
      };

      const response = await api.post<AuthResponse>('/api/v1/signup', payload);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        const errors = error.response.data.error;
        if (Array.isArray(errors)) {
          throw new Error(errors.join(', '));
        }
      }
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}