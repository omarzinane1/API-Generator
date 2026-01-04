export const authService = {
  getToken: () => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("api_generator_token")
  },

  getUser: () => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("api_generator_user")
    return user ? JSON.parse(user) : null
  },

  setAuth: (token: string, user: any) => {
    localStorage.setItem("api_generator_token", token)
    localStorage.setItem("api_generator_user", JSON.stringify(user))
  },

  logout: () => {
    localStorage.removeItem("api_generator_token")
    localStorage.removeItem("api_generator_user")
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("api_generator_token")
  },
}
