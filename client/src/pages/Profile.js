import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [profileImage, setProfileImage] = useState("");
  const [petInfo, setPetInfo] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile and bookings
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/api/bookings/${user.id}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("❌ Booking load error:", err))
      .finally(() => setLoading(false));

    fetch(`http://localhost:5000/api/profile/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfileImage(data.profileImage || "");
        setPetInfo(Array.isArray(data.pets) ? data.pets : []);
      })
      .catch((err) => {
        console.error("❌ Profile load error:", err);
        setPetInfo([]);
      });
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", user.id);

    try {
      const res = await fetch("http://localhost:5000/api/profile/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setProfileImage(data.imageUrl);
        alert("Image uploaded!");
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handlePetChange = (index, field, value) => {
    setPetInfo((prev) =>
      prev.map((pet, i) =>
        i === index ? { ...pet, [field]: value } : pet
      )
    );
  };

  const addPet = () => {
    setPetInfo((prev) => [...prev, { name: "", age: "", breed: "", medicalHistory: "" }]);
  };

  const removePet = (index) => {
    setPetInfo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          profileImage,
          pets: petInfo,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Profile saved!");
        setPetInfo(data.pets);

        
        
      } else {
        alert(data.message || "Save failed");
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/profile/delete/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("user");
        window.location.href = "/";
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-photo">
          <img
            src={profileImage || "https://via.placeholder.com/120"}
            alt="Profile"
            className="profile-img"
          />
          <input type="file" onChange={handleFileChange} className="file-input" />
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-id">User ID: {user?.id}</p>
          <Link to="/" className="home-button">🏠 Home</Link>
        </div>
      </div>

      <h3 className="section-title">Pet Information</h3>
      <table className="pet-table">
        <thead>
          <tr>
            <th>Pet ID</th>
            <th>Pet Name</th>
            <th>Age</th>
            <th>Breed</th>
            <th>Medical History</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {petInfo.length > 0 ? (
            petInfo.map((pet, index) => (
              <tr key={index}>
                <td>{pet?.id ?? "N/A"}</td>
                <td><input value={pet.name} onChange={(e) => handlePetChange(index, "name", e.target.value)} /></td>
                <td><input type="number" value={pet.age} onChange={(e) => handlePetChange(index, "age", e.target.value)} /></td>
                <td><input value={pet.breed} onChange={(e) => handlePetChange(index, "breed", e.target.value)} /></td>
                <td><input value={pet.medicalHistory} onChange={(e) => handlePetChange(index, "medicalHistory", e.target.value)} /></td>
                <td><button className="delete-btn" onClick={() => removePet(index)}>🗑️</button></td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">No pets found. Add one below.</td></tr>
          )}
        </tbody>
      </table>

      <div className="table-columns">
        <p><strong>Total Pets:</strong> {petInfo.length}</p>
        <p><strong>Pet Care Tips:</strong> Ensure all pets are vaccinated.</p>
        <p><strong>Need Help?</strong> Contact us for assistance.</p>
      </div>

      <div className="profile-actions">
        <button className="add-pet-btn" onClick={addPet}>+ Add Another Pet</button>
        <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
        <button className="delete-profile-btn" onClick={handleDeleteProfile}>Delete Profile</button>
      </div>

      <h3 className="section-title">My Booking History</h3>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking, index) => (
            <div className="booking-card" key={booking.id}>
              <h4>#Booking {index + 1}</h4>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Pet Name:</strong> {booking.pet_name || "N/A"}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Dates:</strong> {
                (() => {
                  try {
                    const parsed = Array.isArray(booking.dates) ? booking.dates : JSON.parse(booking.dates);
                    return Array.isArray(parsed) ? parsed.join(", ") : "N/A";
                  } catch {
                    return "N/A";
                  }
                })()
              }</p>
              <p><strong>Add-On:</strong> {booking.add_on}</p>
              <p><strong>Notes:</strong> {booking.notes || "None"}</p>
              <p><strong>Total:</strong> RM {booking.total}</p>
              <p><strong>Status:</strong> <span className={`status-badge ${booking.status?.toLowerCase()}`}>{booking.status}</span></p>
              <p className="created-at">Booked on: {new Date(booking.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
