import React from "react";
import { Link } from "react-router-dom";
import "./AdminHeader.css";

function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="admin-logo">PetStay Admin</div>
      <nav className="admin-nav">
        <Link to="/admin-dashboard">Dashboard</Link>
        <Link to="/admin-dashboard#bookings">Bookings</Link>
        <Link to="/admin-dashboard#inbox">Inbox</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </header>
  );
}

export default AdminHeader;
