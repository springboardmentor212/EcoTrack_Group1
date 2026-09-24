import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getProfile, updateProfile } from "../services/profileService";

export default function EditProfile() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "Trapti Singh",
    phone: "+91 78002343299",
    location: "Delhi, India",
    bio: "Passionate about sustainability and green living.",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setEmail(profileData.email); // ✅ populate email
        setForm({
          fullName: profileData.fullName || "",
          phone: profileData.phone || "",
          location: profileData.location || "",
          bio: profileData.bio || "",
        });
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSaving(true);

    try {
      const updated = await updateProfile(form);
      toast.success("Profile updated successfully");
      console.log("Updated profile:", updated); // ✅ see the updated object
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const inputClass =
    "w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
        Edit Profile
      </h1>

      <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[var(--color-slate)]">
              Full Name
            </label>
            <input
              value={form.fullName}
              onChange={handleChange("fullName")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-[var(--color-slate)]">
              Email (cannot be changed)
            </label>
            <input
              value={email}
              disabled
              className={`${inputClass} bg-[var(--color-background)] text-[var(--color-slate)]`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[var(--color-slate)]">
              Phone Number
            </label>
            <input
              value={form.phone}
              onChange={handleChange("phone")}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs text-[var(--color-slate)]">
              Location
            </label>
            <input
              value={form.location}
              onChange={handleChange("location")}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[var(--color-slate)]">Short Bio</label>
          <textarea
            value={form.bio}
            onChange={handleChange("bio")}
            rows={3}
            maxLength={200}
            className={inputClass}
          />
          <p className="text-xs text-[var(--color-slate)] mt-1 text-right">
            {form.bio.length}/200
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="px-4 py-2 text-sm border border-[var(--color-slate)] rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer px-4 py-2 text-sm bg-[var(--color-eco)] text-white rounded-lg disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
