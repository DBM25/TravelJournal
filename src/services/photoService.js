const API_URL = "http://localhost:8080/api/photos";

export const photoService = {

  async getPhotosByAlbum(albumId) {
    const resp = await fetch(`${API_URL}/album/${albumId}`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!resp.ok) throw new Error("Failed to fetch photos");
    const data = await resp.json();
    return data.photos || [];
  },

  
  async uploadPhotoFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    const resp = await fetch(`${API_URL}/upload`, {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
  
      },
      body: formData,
    });
    const data = await resp.json();
    if (!resp.ok || !data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  },

 
  async createPhoto({ albumId, url, caption }) {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({ albumId, url, caption }),
    });
    if (!resp.ok) throw new Error("Failed to create photo");
    const data = await resp.json();
    return data.photo;
  },

  async updatePhotoCaption(photoId, caption) {
    const resp = await fetch(`${API_URL}/${photoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({ caption }),
    });
    if (!resp.ok) throw new Error("Failed to update caption");
    const data = await resp.json();
    return data.photo;
  },


  async deletePhoto(photoId) {
    const resp = await fetch(`${API_URL}/${photoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });
    if (!resp.ok) throw new Error("Failed to delete photo");
  },
};
