import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings(); // Refresh data
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filtered = bookings.filter(
    (b) =>
      b.pet_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h2>📋 All Bookings</h2>

      <button className="status-btn" onClick={() => navigate("/admin-dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="search-bar" style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Search by pet, service or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="bookings-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Service</th>
            <th>Pet</th>
            <th>Dates</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.user_id}</td>
              <td>{b.service_name}</td>
              <td>{b.pet_name}</td>
              <td>{b.dates?.split(",").join(", ")}</td>
              <td>{b.quantity}</td>
              <td>RM {b.total}</td>
              <td>{b.status}</td>
              <td>{b.notes}</td>
              <td>
                <button className="status-btn" onClick={() => handleStatusUpdate(b.id, "Pending")}>Pending</button>
                <button className="status-btn" onClick={() => handleStatusUpdate(b.id, "Confirmed")}>Confirm</button>
                <button className="status-btn" onClick={() => handleStatusUpdate(b.id, "Completed")}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminBookings;
