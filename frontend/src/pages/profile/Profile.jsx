import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../../services/profileService";
import { useAuth } from "../../Context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState({
    id: "",
    email: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // GET PROFILE
  // =========================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await profileService.getProfile();

        setProfile(data);

        setFormData({
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // HANDLE PROFILE INPUT
  // =========================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updatedProfile =
        await profileService.updateProfile(formData);

      setProfile(updatedProfile);

      // Keep form updated
      setFormData({
        email: updatedProfile.email,
        phone: updatedProfile.phone,
      });

      // Keep navbar user information in sync
      localStorage.setItem(
        "user",
        JSON.stringify(updatedProfile)
      );

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // PASSWORD INPUT
  // =========================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setError("");

      await profileService.changePassword(passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });

      setShowPasswordModal(false);

      setMessage("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);

      setError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading profile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage your account information.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* User ID
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              User ID
            </label>

            <input
              type="text"
              value={profile.id}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-500"
            />
          </div> */}

          {/* Profile Form */}
          <form
            onSubmit={handleUpdateProfile}
            className="space-y-5"
          >

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
                onChange={handleProfileChange}
                required
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
                type="text"
                value={formData.phone}
                onChange={handleProfileChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Save */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>

        {/* Account Actions */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-lg font-semibold text-gray-900">
            Account
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your password and session.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              onClick={() => {
                setError("");
                setMessage("");
                setShowPasswordModal(true);
              }}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Change Password
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Logout
            </button>

          </div>
        </div>

      </div>

      {/* ========================= */}
      {/* CHANGE PASSWORD MODAL */}
      {/* ========================= */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your current and new password.
              </p>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="space-y-5"
            >

              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Current Password
                </label>

                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>

                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={changingPassword}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {changingPassword
                    ? "Changing..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}

export default Profile;