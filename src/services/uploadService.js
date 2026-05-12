export async function uploadStoryImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://localhost:8080/api/story-images/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to upload story image");
  }

  const data = await response.json();
  return data.url;
}

export async function uploadProfileImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "http://localhost:8080/api/profile-images/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error("Failed to upload profile image");
  }

  const data = await response.json();
  return data.url;
}
