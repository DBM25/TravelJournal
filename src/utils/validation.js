
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUsername = (username) => {
  if (!username || typeof username !== "string") {
    return { isValid: false, message: "Username is required" };
  }

  const trimmed = username.trim();

  if (trimmed.length < 3) {
    return {
      isValid: false,
      message: "Username must be at least 3 characters long",
    };
  }

  if (trimmed.length > 30) {
    return {
      isValid: false,
      message: "Username must be less than 30 characters",
    };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return {
      isValid: false,
      message:
        "Username can only contain letters, numbers, hyphens, and underscores",
    };
  }

  return { isValid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      message: "Password must be less than 128 characters",
    };
  }

  return { isValid: true, message: "" };
};

export const validateStoryTitle = (title) => {
  if (!title || typeof title !== "string") {
    return { isValid: false, message: "Story title is required" };
  }

  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return { isValid: false, message: "Story title cannot be empty" };
  }

  if (trimmed.length > 100) {
    return {
      isValid: false,
      message: "Story title must be less than 100 characters",
    };
  }

  return { isValid: true, message: "" };
};
