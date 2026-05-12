class AuthService {
  constructor() {
    this.baseUrl = "http://localhost:8080/api/auth";
  }

  async login(username, password) {
    try {
      if (!username || !password) {
        console.error("Username and password are required");
        return null;
      }
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Login failed:",
          errorData.message || "Invalid credentials",
        );
        return null;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  async register(username, password) {
    try {
      if (!username || !password) {
        console.error("Username and password are required");
        return null;
      }
     

      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Registration failed:",
          errorData.message || "Registration failed",
        );
        return null;
      }

      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      return data.user;
    } catch (error) {
      console.error("Registration error:", error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export const authService = new AuthService();
