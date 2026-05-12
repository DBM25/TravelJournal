class AlbumService {
  constructor() {
    this.baseUrl = "http://localhost:8080/api/albums";
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async getAlbums() {
    try {
 
      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.error("Failed to fetch albums");
        return [];
      }

      const data = await response.json();
      return data.albums || [];
    } catch (error) {
      console.error("Get albums error:", error);
      return [];
    }
  }

  async getAlbum(id) {
    try {

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.error("Failed to fetch album");
        return null;
      }

      const data = await response.json();
      return data.album;
    } catch (error) {
      console.error("Get album error:", error);
      return null;
    }
  }

  async createAlbum(title) {
    try {

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to create album:", errorData.message);
        return null;
      }

      const data = await response.json();
      return data.album;
    } catch (error) {
      console.error("Create album error:", error);
      return null;
    }
  }

  async updateAlbum(id, updates) {
    try {
   
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update album:", errorData.message);
        return null;
      }

      const data = await response.json();
      return data.album;
    } catch (error) {
      console.error("Update album error:", error);
      return null;
    }
  }

  async deleteAlbum(id) {
    try {

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete album:", errorData.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Delete album error:", error);
      return false;
    }
  }
}

export const albumService = new AlbumService();
