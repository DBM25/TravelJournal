

const API_URL = "http://localhost:8080/api/profile";

export const profileService = {
  
  async getProfile() {
    const token = localStorage.getItem("token");
    const resp = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      throw new Error(error.error || "Failed to fetch profile");
    }
    return await resp.json();
  },

 
  async updateProfile(updateData) {
    const token = localStorage.getItem("token");
    const resp = await fetch(API_URL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(updateData),
    });
    if (!resp.ok) {
      const error = await resp.json().catch(() => ({}));
      throw new Error(error.error || "Failed to update profile");
    }
    return await resp.json();
  },
};
