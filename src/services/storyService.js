class StoryService {
  constructor() {
    this.baseUrl = "http://localhost:8080/api/stories";
  }

  getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async getStories() {
    try {

      const response = await fetch(this.baseUrl, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.error("Failed to fetch stories");
        return [];
      }

      const data = await response.json();
      return data.stories || [];
    } catch (error) {
      console.error("Get stories error:", error);
      return [];
    }
  }

  async getStory(id) {
    try {
 
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        console.error("Failed to fetch story");
        return null;
      }

      const data = await response.json();
      return data.story;
    } catch (error) {
      console.error("Get story error:", error);
      return null;
    }
  }

  async createStory(title) {
    try {
 
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to create story:", errorData.message);
        return null;
      }

      const data = await response.json();
      return data.story;
    } catch (error) {
      console.error("Create story error:", error);
      return null;
    }
  }

  async updateStory(id, updates) {
    try {

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to update story:", errorData.message);
        return null;
      }

      const data = await response.json();
      return data.story;
    } catch (error) {
      console.error("Update story error:", error);
      return null;
    }
  }

  async deleteStory(id) {
    try {

      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to delete story:", errorData.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Delete story error:", error);
      return false;
    }
  }
}

export const storyService = new StoryService();
