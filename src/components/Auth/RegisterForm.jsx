import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { validateUsername, validatePassword } from "../../utils/validation";
import { cn } from "../../utils/classNames";

const RegisterForm = ({ onToggleMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      setError(usernameValidation.message);
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setIsLoading(false);
      return;
    }

    const success = await register(username.trim(), password);

    if (!success) {
      setError(
        "Registration failed. This username may already be taken or invalid. Please try again.",
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600">
          Sign up to start your travel journal adventure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div
            className={cn(
              "bg-error-50 border border-error-200 text-error-600",
              "px-4 py-3 rounded-md text-sm",
            )}
          >
            {error}
          </div>
        )}

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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
              "placeholder-gray-400 focus:outline-none focus:ring-2",
              "focus:ring-primary-500 focus:border-primary-500 transition-colors",
            )}
            placeholder="Choose a username"
            required
            autoComplete="username"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm",
                "placeholder-gray-400 focus:outline-none focus:ring-2",
                "focus:ring-primary-500 focus:border-primary-500 transition-colors",
              )}
              placeholder="Create a password"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center px-4 py-2",
            "border border-transparent rounded-md shadow-sm text-sm font-medium",
            "text-white bg-primary-600 hover:bg-primary-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          )}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
