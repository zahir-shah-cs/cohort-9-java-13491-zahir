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