import React, { useEffect, useState } from "react";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import "../styles/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return;

    fetch(`http://localhost:5000/api/bookings/${currentUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("❌ Expected an array but got:", data);
          return;
        }

        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const safeParseDates = (dates) => {
    try {
      const parsed = Array.isArray(dates) ? dates : JSON.parse(dates);
      return Array.isArray(parsed) ? parsed.join(", ") : "N/A";
    } catch (err) {
      console.warn("⚠️ Failed to parse dates:", err);
      return "N/A";
    }
  };

  return (
    <div className="my-bookings-page">
      <h2>My Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-cards">
          {bookings.map((booking, index) => (
            <div className="booking-card" key={booking.id}>
              <h4>#Booking {index + 1}</h4>
              <p><strong>Service:</strong> {booking.service}</p>
              <p><strong>Pet Name:</strong> {booking.pet_name || "N/A"}</p>
              <p><strong>Quantity:</strong> {booking.quantity}</p>
              <p><strong>Dates:</strong> {safeParseDates(booking.dates)}</p>
              <p><strong>Add-On:</strong> {booking.add_on}</p>
              <p><strong>Notes:</strong> {booking.notes || "None"}</p>
              <p><strong>Total:</strong> RM {booking.total}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
              </p>

              {/* ✅ Show feedback only for COMPLETED bookings */}
              {booking.status === "Completed" && (
                <div className="feedback-section">
                  <h4>Leave Feedback</h4>
                  <FeedbackForm bookingId={booking.id} onFeedbackSubmitted={() => {}} />
                  <FeedbackList bookingId={booking.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
