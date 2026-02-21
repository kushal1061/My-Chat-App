import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  const [saved, setSaved] = useState(false);
  const[user,setUser]=useState('');
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
    const token = localStorage.getItem('token');
    const details =await axios.get(`http://localhost:5000/api/user/me`,{
      headers:{
        Authorization : `Bearer ${token}`
      }
    });
    console.log(details.data);
    setUser(details.data  );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result?.toString() || "";
      setPhoto(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("profile", JSON.stringify(profile));
    localStorage.setItem("profilePhoto", photo);
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div
      className="min-h-screen bg-[#f6f1e9] text-[#1f1a1a] relative overflow-hidden"
      style={{ fontFamily: '"Space Grotesk", sans-serif' }}
    >
      <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-[#f0c27b] blur-3xl opacity-50" />
      <div className="absolute top-40 -right-32 h-72 w-72 rounded-full bg-[#7dd3c7] blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-20 h-64 w-64 rounded-full bg-[#f7a8a8] blur-3xl opacity-40" />

      <div className="relative max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#7a6a56]">
              Profile Studio
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold">
              Shape your presence
            </h1>
            <p className="text-sm text-[#5b5144] mt-2">
              Update your photo and keep your details fresh for every chat.
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 border border-[#1f1a1a] text-sm rounded-full hover:bg-[#1f1a1a] hover:text-white transition"
          >
            Back to chat
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white/80 backdrop-blur border border-[#e5d8c5] rounded-2xl p-6 shadow-[0_18px_40px_rgba(31,26,26,0.12)]">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-[#1f1a1a] text-white flex items-center justify-center text-3xl">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile preview"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <span className="absolute -bottom-2 -right-2 bg-[#f0c27b] text-[#1f1a1a] text-xs font-semibold px-2 py-1 rounded-full">
                  Live
                </span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{user?.name || "Your Name"}</h2>
                <p className="text-sm text-[#6d5f52]">{user?.status || "No status set"}</p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1f1a1a] text-sm cursor-pointer hover:bg-[#1f1a1a] hover:text-white transition">
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="text-xs uppercase tracking-[0.2em] text-[#6d5f52] hover:text-[#1f1a1a]"
              >
                Remove photo
              </button>
              <div className="w-full text-left mt-2">
                <p className="text-xs text-[#6d5f52] uppercase tracking-[0.2em] mb-2">
                  Quick notes
                </p>
                <div className="bg-[#fef7ec] border border-[#f0d5aa] rounded-xl p-3 text-sm text-[#5b5144]">
                      {user?.bio || "Add a short intro, hobbies, or a note for your contacts."}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/90 backdrop-blur border border-[#e5d8c5] rounded-2xl p-6 shadow-[0_18px_40px_rgba(31,26,26,0.12)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">
                  Display name
                </label>
                <input
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  placeholder="Add your name"
                  className="rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">
                  Status
                </label>
                <input
                  name="status"
                  value={profile.status}
                  onChange={handleChange}
                  placeholder="Available, busy, away..."
                  className="rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder={user?.email || "you@email.com"}
                  className="rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">
                  Phone
                </label>
                <input
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder={user?.phone || "Phone number"}
                  className="rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-[#6d5f52]">
                About you
              </label>
              <textarea
                name="bio"
                value={user?.bio || profile.bio}
                onChange={handleChange}
                placeholder="Share a short intro, hobbies, or a note for your contacts."
                rows={5}
                className="rounded-xl border border-[#ead8c3] bg-[#fffaf2] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f0c27b]"
              />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#1f1a1a] text-white text-sm tracking-[0.2em] uppercase hover:bg-[#3a2f2f] transition"
              >
                Save changes
              </button>
              {saved && (
                <span className="text-sm text-[#4f7a63]">
                  Profile updated and saved locally.
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
