import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl"
          >
            C.Management
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {/* Home */}
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              Home
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
            >
              Contact Us
            </Link>

            {/* Not Logged In */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}

            {/* Logged In */}
            {isAuthenticated && (
              <>
                <Link
                  to="/contact/manage"
                  className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
                >
                  Manage Contacts
                </Link>

                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>

                <span className="max-w-[180px] truncate text-sm font-medium text-gray-600">
                  {user?.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile / Tablet Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              // X icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile / Tablet Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {/* Home */}
              <Link
                to="/"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Home
              </Link>

              {/* Contact */}
              <Link
                to="/contact"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                Contact Us
              </Link>

              {/* Not Logged In */}
              {!isAuthenticated && (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}

              {/* Logged In */}
              {isAuthenticated && (
                <>
                  <Link
                    to="/contact/manage"
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    Manage Contacts
                  </Link>

                  <Link
                    to="/profile"
                    className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    Profile
                  </Link>

                  {/* User */}
                  <div className="mt-2 border-t border-gray-100 px-3 pt-4">
                    <p className="mb-3 truncate text-sm font-medium text-gray-600">
                      {user?.email}
                    </p>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
