import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:2000',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and better error handling
  timeout: 5000,
  validateStatus: (status) => {
    return status >= 200 && status < 500
  }
})

api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers
    })
    
    const token = localStorage.getItem('token')
    if (token) {
      if (!config.headers) {
        config.headers = {}
      }
      config.headers.token = token
    }
    return config
  },
  (error) => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    return Promise.reject(error)
  }
)

export default api