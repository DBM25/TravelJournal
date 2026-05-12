import React, { useState } from "react";
import { User, Camera, Save, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { uploadProfileImage } from "../services/uploadService";
import coverPhoto from "../assets/profile-cover.webp";

const BACKEND_BASE_URL = "http://localhost:8080";

const getImageUrl = (url) => {
  return url && url.startsWith("/uploads/") ? `${BACKEND_BASE_URL}${url}` : url;
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    name: user?.name || "",
    profilePicture: user?.profilePicture || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadProfileImage(file);
        setFormData((prev) => ({
          ...prev,
          profilePicture: url,
        }));
      } catch (err) {
        setMessage("Failed to upload profile image.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        setMessage("Password must be at least 6 characters long.");
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords do not match.");
        setIsLoading(false);
        return;
      }
    }

    if (formData.username.trim().length < 3) {
      setMessage("Username must be at least 3 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const updateData = {
        username: formData.username.trim(),
        name: formData.name.trim(),
        profilePicture: formData.profilePicture,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const success = await updateProfile(updateData);
      if (success) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred while updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      name: user?.name || "",
      profilePicture: user?.profilePicture || "",
      password: "",
      confirmPassword: "",
    });
    setIsEditing(false);
    setMessage("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const removeProfilePicture = () => {
    setFormData((prev) => ({ ...prev, profilePicture: "" }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setMessage("");
  };

  if (!isEditing) {

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

            <div
              className="relative w-full flex items-center justify-center"
              style={{
                aspectRatio: "4/3",
                overflow: "hidden",
                background: "#000",
              }}
            >
              <img
                src={coverPhoto}
                alt="Cover"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
              <div className="absolute inset-0 bg-black/30" />

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <div className="relative mb-2">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                    {user?.profilePicture ? (
                      <img
                        src={getImageUrl(user.profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="text-center space-y-1 mt-2">
                  {user?.name && user.name.trim() && (
                    <h1 className="text-2xl font-bold text-white drop-shadow">
                      {user.name}
                    </h1>
                  )}
                  <p className="text-lg text-gray-200 font-medium drop-shadow">
                    @{user?.username}
                  </p>
                </div>
              </div>
            </div>
 
            <div className="px-8 py-6">
              <button
                onClick={handleEditClick}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-sm"
              >
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

 
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Edit Profile</h1>
              <button
                onClick={handleCancel}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {message && (
              <div
                className={`mb-6 p-4 rounded-xl ${
                  message.includes("successfully")
                    ? "bg-success-50 border border-success-200 text-success-700"
                    : "bg-error-50 border border-error-200 text-error-700"
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
  
              <div className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Profile Picture
                </label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-gray-200">
                      {formData.profilePicture ? (
                        <img
                          src={getImageUrl(formData.profilePicture)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    {formData.profilePicture && (
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="absolute -top-1 -right-1 p-1 bg-error-100 text-error-600 rounded-full hover:bg-error-200 transition-colors shadow-sm"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
 
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
 
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your username"
                  required
                  minLength={3}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Leave blank to keep current password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {formData.password && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Confirm your new password"
                      required={!!formData.password}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isLoading ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
