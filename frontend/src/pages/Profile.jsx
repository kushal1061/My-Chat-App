import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Trash2, User, Mail, Phone, Activity } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  phone: "",
  status: "Available",
  bio: "",
};

export default function Profile() {
  const storedPhone = localStorage.getItem("phone") || "";
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, phone: storedPhone });
  const [photo, setPhoto] = useState("");
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const initials = useMemo(() => {
    const base = profile.name || "You";
    return base
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile.name]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const details = await axios.get("http://localhost:5000/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(details.data);
      setProfile((prev) => ({ ...prev, ...details.data }));
      setPhoto(details.data.profilePic);  
    } catch (error) {
      toast.error("Failed to load profile details");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    const token = localStorage.getItem("token");
    if (!file) return;
    const res = await axios.post(
      "http://localhost:5000/api/upload",
      { fileName: file.name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const { url, fileurl } = res.data;
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const updateProfile = await axios.put(
      "http://localhost:5000/api/user/updateProfilePic",
      { profilePic: fileurl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (updateProfile.data.url) {
      setPhoto(updateProfile.data.url);
      toast.success("Photo updated successfully!");
    } else {
      toast.error("Failed to update profile picture");
    }
  };

  const handleRemovePhoto = () => {
    setPhoto("");
    toast.success("Photo removed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("profile", JSON.stringify(profile));
      localStorage.setItem("profilePhoto", photo);
      toast.success("Profile updated successfully!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Top bar */}
      <div className="sticky top-0 z-10 glass border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-semibold text-text-primary text-lg">Profile</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        {/* Avatar card */}
        <div className="bg-surface rounded-2xl border border-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-2 border-border bg-surface-tertiary flex items-center justify-center text-2xl font-bold text-text-tertiary overflow-hidden">
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <label className="absolute -bottom-1 -right-1 p-2 bg-accent text-text-inverse rounded-xl cursor-pointer hover:bg-accent-hover transition-all shadow-soft">
                <Camera size={14} />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-text-primary">{profile.name || "Your Name"}</h2>
              <p className="text-sm text-text-secondary mt-1">{profile.status || "Set a status"}</p>
              {photo && (
                <Button
                  variant="danger"
                  size="xs"
                  icon={Trash2}
                  onClick={handleRemovePhoto}
                  className="mt-3"
                >
                  Remove Photo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Personal Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                value={profile.name}
                onChange={handleChange}
                label="Display Name"
                icon={User}
                placeholder="Add your name"
              />
              <Input
                name="status"
                value={profile.status}
                onChange={handleChange}
                label="Status"
                icon={Activity}
                placeholder="Available, busy, away..."
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                Bio
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Share a short intro, hobbies, or a note for your contacts."
                rows={3}
                className="w-full rounded-xl px-4 py-2.5 text-sm bg-surface-tertiary text-text-primary border border-border placeholder:text-text-tertiary focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-muted transition-all resize-none"
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
              Contact Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                label="Email"
                icon={Mail}
                placeholder={user?.email || "you@email.com"}
              />
              <Input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                label="Phone"
                icon={Phone}
                placeholder={user?.phone || "Phone number"}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={isLoading} size="lg">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
