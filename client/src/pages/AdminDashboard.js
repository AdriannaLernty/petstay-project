import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

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

  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.total || 0), 0);
  const pending = bookings.filter(b => b.status === "Pending").length;
  const completed = bookings.filter(b => b.status === "Completed").length;
  const newOrders = bookings.length;

  // Example chart data (fake, replace later with real trends)
  const chartData = [
    { name: "Mon", Today: 3, Yesterday: 2 },
    { name: "Tue", Today: 2, Yesterday: 3 },
    { name: "Wed", Today: 4, Yesterday: 2 },
    { name: "Thu", Today: 1, Yesterday: 4 },
    { name: "Fri", Today: 5, Yesterday: 3 },
  ];

  return (
    <div className="admin-dashboard-new">
      <h1 className="admin-greeting">WELCOME BACK, ADMIN!</h1>

      <div className="admin-stats">
        <div className="stat-box blue">Completed Orders<br /><span>{completed}</span></div>
        <div className="stat-box red">Pending Orders<br /><span>{pending}</span></div>
        <div className="stat-box purple">New Orders<br /><span>{newOrders}</span></div>
      </div>

      <div className="admin-widgets">
        <div className="inbox-box">
          <h3>Inbox <span className="view-link">View details</span></h3>
          {bookings
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 2)
            .map((order) => (
              <p key={order.id}>
                {order.status === "Completed" ? "✅" : "📩"}{" "}
                {order.status} order #{order.id}
              </p>
            ))}
        </div>


        <div className="chart-box">
          <h3>Today's trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Today" stroke="#3b82f6" />
              <Line type="monotone" dataKey="Yesterday" stroke="#cbd5e1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="revenue-display">Total Revenue: <strong className="green">RM {totalRevenue}</strong></div>
    </div>
  );
}

export default AdminDashboard;
