"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { getCurrentUser, getUserData, UserData } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuthorization } from "@/lib/useAuthorization";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    role: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Add authorization check - this page is accessible to both admin and user roles
  const { authorizeRoute, loading: authLoading } = useAuthorization();

  useEffect(() => {
    // Check if user is authorized to access this page
    authorizeRoute("/dashboard/settings");
  }, []);

  useEffect(() => {
    // Fetch user data only if authorization check is complete
    if (!authLoading) {
      const fetchUser = async () => {
        try {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            const userData = await getUserData(currentUser.uid);
            setUser(userData);
            // Prefill form with user data
            setFormData({
              ...formData,
              displayName: userData?.displayName || "",
              email: userData?.email || "",
              role: userData?.role || "user",
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setMessage({
            type: "error",
            text: "Failed to load user data. Please try again.",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [authLoading]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset message
    setMessage({ type: "", text: "" });

    // Validate form
    if (!formData.displayName) {
      setMessage({ type: "error", text: "Name is required" });
      return;
    }

    setSaving(true);

    try {
      // In a real app, you would update the user's profile in the database
      // This is a mock implementation
      setTimeout(() => {
        // Update local state to reflect changes
        setUser({
          ...user!,
          displayName: formData.displayName,
          email: formData.email,
        });

        setMessage({
          type: "success",
          text: "Profile updated successfully",
        });
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset message
    setMessage({ type: "", text: "" });

    // Validate form
    if (!formData.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    if (!formData.newPassword) {
      setMessage({ type: "error", text: "New password is required" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setSaving(true);

    try {
      // In a real app, you would update the user's password in Firebase Auth
      // This is a mock implementation
      setTimeout(() => {
        setMessage({
          type: "success",
          text: "Password changed successfully",
        });

        // Reset password fields
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: "Failed to change password. Please try again.",
      });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "error"
              ? "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <Card title="Profile Settings">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Display Name
            </label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Email cannot be changed. Contact support for assistance.
            </p>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </label>
            <input
              type="text"
              name="role"
              id="role"
              value={formData.role}
              disabled
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Card>

      {/* Password Settings */}
      <Card title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </Card>

      {/* Theme Settings */}
      <Card title="Theme Settings">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Toggle between light and dark mode using the switch in the top
          navigation bar.
        </p>
      </Card>

      {/* Danger Zone */}
      <Card
        title="Danger Zone"
        className="border border-red-200 dark:border-red-900"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Actions here are irreversible. Please proceed with caution.
        </p>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none"
        >
          Delete Account
        </button>
      </Card>
    </div>
  );
}
