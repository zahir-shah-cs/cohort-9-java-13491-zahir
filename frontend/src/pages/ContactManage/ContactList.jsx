import React, { useEffect, useState } from "react";
import contactService from "../../services/contactService.js";

function ContactList() {

  const [contacts, setContacts] = useState([]);

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Edit mode
  const [editingContact, setEditingContact] = useState(null);

  // Contact to delete
  const [deletingContact, setDeletingContact] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [saving, setSaving] = useState(false);


  // =========================
  // GET CONTACTS
  // =========================

  const fetchContacts = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await contactService.getContacts(
        page,
        size,
        search
      );

      setContacts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

    } catch (error) {

      console.error("Error fetching contacts:", error);

      setError(
        error.response?.data?.message ||
        "Failed to load contacts."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchContacts();

  }, [page, search]);


  // =========================
  // SEARCH
  // =========================

  const handleSearch = (e) => {

    setSearch(e.target.value);
    setPage(0);

  };


  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // =========================
  // OPEN CREATE MODAL
  // =========================

  const handleCreate = () => {

    setEditingContact(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
    });

    setError("");
    setShowFormModal(true);

  };


  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleEdit = (contact) => {

    setEditingContact(contact);

    setFormData({
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
    });

    setError("");
    setShowFormModal(true);

  };


  // =========================
  // SAVE CREATE / UPDATE
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);
      setError("");

      if (editingContact) {

        // UPDATE
        await contactService.updateContact(
          editingContact.id,
          formData
        );

      } else {

        // CREATE
        await contactService.createContact(
          formData
        );

      }

      setShowFormModal(false);

      setEditingContact(null);

      setFormData({
        name: "",
        email: "",
        phone: "",
      });

      // Refresh list
      await fetchContacts();

    } catch (error) {

      console.error("Error saving contact:", error);

      setError(
        error.response?.data?.message ||
        "Failed to save contact."
      );

    } finally {

      setSaving(false);

    }
  };


  // =========================
  // OPEN DELETE MODAL
  // =========================

  const handleDeleteClick = (contact) => {

    setDeletingContact(contact);

    setShowDeleteModal(true);

  };


  // =========================
  // DELETE CONTACT
  // =========================

  const handleDelete = async () => {

    if (!deletingContact) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      await contactService.deleteContact(
        deletingContact.id
      );

      setShowDeleteModal(false);
      setDeletingContact(null);

      await fetchContacts();

    } catch (error) {

      console.error("Error deleting contact:", error);

      setError(
        error.response?.data?.message ||
        "Failed to delete contact."
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              My Contacts
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Manage your contacts.
            </p>

          </div>

          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Contact
          </button>

        </div>


        {/* =========================
            SEARCH
        ========================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search contacts by name..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (

          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>

        )}


        {/* =========================
            CONTACT TABLE
        ========================= */}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

          {loading ? (

            <div className="p-8 text-center text-sm text-gray-500">
              Loading contacts...
            </div>

          ) : contacts.length === 0 ? (

            <div className="p-8 text-center">

              <p className="text-sm text-gray-500">
                No contacts found.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[650px]">

                <thead className="border-b border-gray-200 bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-gray-200">

                  {contacts.map((contact) => (

                    <tr
                      key={contact.id}
                      className="hover:bg-gray-50"
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
                            onClick={() =>
                              handleEdit(contact)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
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

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =========================
            PAGINATION
        ========================= */}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-gray-600">

            Total contacts:{" "}

            <span className="font-medium text-gray-900">
              {totalElements}
            </span>

          </p>


          <div className="flex items-center gap-2">

            <button
              disabled={page === 0}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>


            <span className="px-3 text-sm text-gray-600">
              Page {page + 1} of {totalPages}
            </span>


            <button
              disabled={page >= totalPages - 1}
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          CREATE / EDIT MODAL
      ================================================== */}

      {showFormModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            {/* Modal Header */}

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-xl font-semibold text-gray-900">

                {editingContact
                  ? "Update Contact"
                  : "Create Contact"}

              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowFormModal(false)
                }
                className="text-xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  type="text"
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

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Phone */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="03001234567"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowFormModal(false)
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingContact
                      ? "Update Contact"
                      : "Create Contact"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ==================================================
          DELETE CONFIRMATION MODAL
      ================================================== */}

      {showDeleteModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-semibold text-gray-900">
              Delete Contact
            </h2>

            <p className="mt-3 text-sm text-gray-600">

              Are you sure you want to delete{" "}

              <span className="font-semibold text-gray-900">
                {deletingContact?.name}
              </span>

              ?

            </p>


            <div className="mt-6 flex justify-end gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingContact(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default ContactList;