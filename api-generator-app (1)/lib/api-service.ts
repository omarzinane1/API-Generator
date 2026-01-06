import { authService } from "./auth-service"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"

async function request(endpoint: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || data.message || "Something went wrong")
  }

  return data
}

export const apiService = {
  // ==========================
  // Auth
  // ==========================
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

  // ==========================
  // Functions (JWT required)
  // ==========================
  createFunction: (config: any) => {
    const token = authService.getToken()
    if (!token) throw new Error("Not logged in")
    return request("/functions", {
      method: "POST",
      body: JSON.stringify(config),
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  getFunctions: () => {
    const token = authService.getToken()
    if (!token) throw new Error("Not logged in")
    return request("/functions", {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  getFunction: (id: string) => {
    const token = authService.getToken()
    if (!token) throw new Error("Not logged in")
    return request(`/functions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  deleteFunction: (id: string) => {
    const token = authService.getToken()
    if (!token) throw new Error("Not logged in")
    return request(`/functions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  // ==========================
  // Test / Execute function (API Key required)
  // ==========================
  testFunction: (functionId: string, parameters: any, apiKey: string) =>
    request(`/functions/${functionId}`, {
      method: "POST",
      body: JSON.stringify({ parameters }),
      headers: {
        "x-api-key": apiKey, // clé API envoyée au backend
      },
    }),
}
