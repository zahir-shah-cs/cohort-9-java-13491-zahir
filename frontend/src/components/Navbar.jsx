import React from "react";

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Contact Management 
        </a>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Home
          </a>

          <a
            href="/contact"
            className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
          >
            Contact Us
          </a>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;