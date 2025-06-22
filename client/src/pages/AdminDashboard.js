import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";


function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      console.log(data.message);
      fetchBookings(); // Refresh after update
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.pet_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total || 0), 0);

  return (
    <div className="admin-dashboard">
      

      <div className="admin-content">
        <h2>Welcome, Admin</h2>

        <div className="admin-summary">
          <div className="summary-card">New Orders: {bookings.length}</div>
          <div className="summary-card">Pending: {bookings.filter(b => b.status === "Pending").length}</div>
          <div className="summary-card">Confirmed: {bookings.filter(b => b.status === "Confirmed").length}</div>
          <div className="summary-card">Completed: {bookings.filter(b => b.status === "Completed").length}</div>
          <div className="summary-card">Total Revenue: RM {totalRevenue}</div>
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by pet or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="booking-table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Service</th>
                <th>Pet</th>
                <th>Dates</th>
                <th>Qty</th>
                <th>Total (RM)</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.user_id}</td>
                  <td>{b.service_name}</td>
                  <td>{b.pet_name}</td>
                  <td>{b.dates?.split(",").join(", ")}</td>
                  <td>{b.quantity}</td>
                  <td>{b.total}</td>
                  <td>{b.status}</td>
                  <td>{b.notes}</td>
                  <td>
                    <button onClick={() => handleStatusUpdate(b.id, "Pending")}>Pending</button>
                    <button onClick={() => handleStatusUpdate(b.id, "Confirmed")}>Confirm</button>
                    <button onClick={() => handleStatusUpdate(b.id, "Completed")}>Complete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="inbox-section">
          <h3>📬 Inbox (coming soon...)</h3>
          <p>Feature to manage customer feedback and messages will be added here.</p>
        </div>
      </div>

      
    </div>
  );
}

export default AdminDashboard;
