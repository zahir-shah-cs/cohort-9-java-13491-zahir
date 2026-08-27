import React from "react";

const Home = () => {
  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Contact Management System
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            A simple application for creating, managing, searching, and
            organizing contact information.
          </p>
        </div>

        {/* Main Content */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Create Contact */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Create Contact
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Add a new contact with personal details, email addresses, and
              phone numbers.
            </p>

            <a
              href="/contact"
              className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Create Contact →
            </a>
          </div>

          {/* Contact Management */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Manage Contacts
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              View, update, and delete existing contacts from the contact
              management interface.
            </p>

            <span className="mt-5 inline-block text-sm font-medium text-gray-400">
              Admin Feature
            </span>
          </div>

          {/* Search & Pagination */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Search & Pagination
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Search contacts by first name or last name and browse contacts
              using pagination.
            </p>

            <span className="mt-5 inline-block text-sm font-medium text-gray-400">
              Admin Feature
            </span>
          </div>
        </div>

        {/* Implementation Overview */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Application Features
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Contact Creation
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Create new contact records
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Contact Details
              </p>
              <p className="mt-1 text-xs text-gray-500">
                View complete contact profiles
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Contact Management
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Update and delete contacts
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900">
                Search & Pagination
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Find and navigate contacts
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;