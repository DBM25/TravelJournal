import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen, User, LogOut, Home, FileText, Camera } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const BACKEND_BASE_URL = "http://localhost:8080";

const getImageUrl = (url) => {
  return url && url.startsWith("/uploads/") ? `${BACKEND_BASE_URL}${url}` : url;
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === "/home";

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              to="/home"
              className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <BookOpen className="w-8 h-8" />
              <span>MyTravelJournal</span>
            </Link>
          </div>

          {user && (
            <nav className="hidden md:flex items-center space-x-8">
              {!isHome && (
                <Link
                  to="/home"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/home")
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              )}

              <Link
                to="/stories"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/stories") ||
                  location.pathname.startsWith("/story") ||
                  location.pathname.startsWith("/editor")
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Stories</span>
              </Link>

              <Link
                to="/albums"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/albums") || location.pathname.startsWith("/album")
                    ? "text-secondary-600 bg-secondary-50"
                    : "text-gray-700 hover:text-secondary-600 hover:bg-gray-50"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Albums</span>
              </Link>
            </nav>
          )}

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-sm text-gray-700 hover:text-primary-600 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  {user.profilePicture ? (
                    <img
                      src={getImageUrl(user.profilePicture)}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-primary-600" />
                  )}
                </div>
                <span className="hidden sm:block">{user.username}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-error-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
