import React, { useMemo, useState } from "react";

function ContactList() {
  // Temporary data
  // Later this will come from your Spring Boot API
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 987 654 321",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+1 555 123 456",
    },
  ]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedContact, setSelectedContact] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const contactsPerPage = 5;

  // Search / Filter
  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [contacts, search]);

  // Pagination
  const totalPages = Math.ceil(
    filteredContacts.length / contactsPerPage
  );

  const startIndex =
    (currentPage - 1) * contactsPerPage;

  const currentContacts = filteredContacts.slice(
    startIndex,
    startIndex + contactsPerPage
  );

  // Search change
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Open Create Modal
  const handleCreate = () => {
    setSelectedContact(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleEdit = (contact) => {
    setSelectedContact(contact);

    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    });

    setIsFormOpen(true);
  };

  // Form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save contact
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedContact) {
      // Update
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContact.id
            ? {
                ...contact,
                ...formData,
              }
            : contact
        )
      );
    } else {
      // Create
      const newContact = {
        id: Date.now(),
        ...formData,
      };

      setContacts((prev) => [
        ...prev,
        newContact,
      ]);
    }

    setIsFormOpen(false);
  };

  // Open delete confirmation
  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setIsDeleteOpen(true);
  };

  // Delete contact
  const handleDelete = () => {
    setContacts((prev) =>
      prev.filter(
        (contact) =>
          contact.id !== selectedContact.id
      )
    );

    setIsDeleteOpen(false);
    setSelectedContact(null);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Contact Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your contacts
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            + Create Contact
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

          <label
            htmlFor="search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search Contacts
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search by name..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-md"
          />
        </div>

        {/* Contact Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full text-left">

              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">

                {currentContacts.length > 0 ? (
                  currentContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="transition hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {contact.name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.email}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {contact.phone}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">

                          <button
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              handleEdit(contact)
                            }
                            className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteClick(contact)
                            }
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      No contacts found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-gray-100 md:hidden">

            {currentContacts.length > 0 ? (
              currentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-5"
                >

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">
                      {contact.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-600">
                      {contact.email}
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      {contact.phone}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    <button
                      className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleEdit(contact)
                      }
                      className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteClick(contact)
                      }
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            ) : (
              <div className="px-5 py-12 text-center text-sm text-gray-500">
                No contacts found.
              </div>
            )}

          </div>

        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}

      </div>

      {/* Create / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-semibold text-gray-900">
                {selectedContact
                  ? "Update Contact"
                  : "Create Contact"}
              </h2>

              <button
                onClick={() => setIsFormOpen(false)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 234 567 890"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {selectedContact
                    ? "Save Changes"
                    : "Create Contact"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold text-gray-900">
              Delete Contact
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {selectedContact.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => {
                  setIsDeleteOpen(false);
                  setSelectedContact(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default ContactList;