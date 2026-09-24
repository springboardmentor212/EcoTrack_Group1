import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getProfile, deleteAccount } from "../services/profileService";

export default function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDelete = async () => {
    if (
      !window.confirm("Delete your account permanently? This cannot be undone.")
    )
      return;
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (loading)
    return <p className="text-sm text-[var(--color-slate)]">Loading...</p>;

  const memberSince = profile?.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  const details = [
    ["Email", profile?.email || "Not added"],
    ["Phone", profile?.phone || "Not added"],
    ["Location", profile?.location || "Not added"],
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex border-b border-[var(--color-slate)]/20 gap-4">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-2 text-sm font-semibold transition-colors ${
            activeTab === "profile"
              ? "border-b-2 border-[var(--color-eco)] text-[var(--color-primary)]"
              : "text-[var(--color-slate)] hover:text-[var(--color-primary)]"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-2 text-sm font-semibold transition-colors ${
            activeTab === "settings"
              ? "border-b-2 border-[var(--color-eco)] text-[var(--color-primary)]"
              : "text-[var(--color-slate)] hover:text-[var(--color-primary)]"
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === "profile" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[var(--color-eco)] flex items-center justify-center text-white text-2xl font-semibold">
                {profile?.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-primary)]">
                  {profile?.fullName}
                </h1>
                <p className="text-xs text-[var(--color-slate)] mt-1">
                  Member since {memberSince}
                </p>
              </div>
            </div>
            <Link
              to="/profile/edit"
              className="px-4 py-2 text-sm bg-[var(--color-eco)] text-white rounded-lg"
            >
              Edit Profile
            </Link>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[var(--color-primary)] mb-4">
              Personal Details
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {details.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-[var(--color-slate)]">{label}</p>
                  <p className="text-sm text-[var(--color-text-dark)] mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--color-slate)]">About</p>
            <p className="text-sm text-[var(--color-text-dark)] mt-1">
              {profile?.bio || "No bio added yet."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Settings
          </h1>

          <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-[var(--color-primary)] mb-4">
              Password
            </h3>
            <p className="text-xs text-[var(--color-slate)]">Email</p>
            <p className="text-sm text-[var(--color-text-dark)] mt-1 mb-4">
              {profile?.email}
            </p>
            <Link
              to="/forgot-password"
              className="inline-block text-sm bg-[var(--color-eco)]/100 text-white px-4 py-2 rounded-lg"
            >
              Change Password
            </Link>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="font-semibold text-red-600 mb-1">Delete Account</h3>
            <p className="text-xs text-red-500 mb-3">
              This permanently deletes your account and profile. It cannot be
              undone.
            </p>
            <button
              onClick={handleDelete}
              className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
