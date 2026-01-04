import { authService } from "./auth-service"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

async function request(endpoint: string, options: RequestInit = {}) {
  const token = authService.getToken()
  

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

export const apiService = {
  login: (email: string, password: string) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  createFunction: (config: any) =>
    request("/functions", {
      method: "POST",
      body: JSON.stringify(config),
    }),

  getFunctions: () => request("/functions"),

  getFunction: (id: string) => request(`/functions/${id}`),

  deleteFunction: (id: string) =>
    request(`/functions/${id}`, {
      method: "DELETE",
    }),

  testFunction: (id: string, parameters: any) =>
    request(`/functions/${id}`, {
      method: "POST",
      body: JSON.stringify({ parameters }),
    }),
}
