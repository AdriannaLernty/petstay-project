import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Cart.css";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [editIndex, setEditIndex] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (index) => removeFromCart(index);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedBooking(cart[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    const updatedCart = [...cart];
    const newTotal =
      (parseFloat(editedBooking.total) / editedBooking.quantity) *
      editedBooking.quantity;

    updatedCart[editIndex] = {
      ...editedBooking,
      total: newTotal.toFixed(2),
    };

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      if (editedBooking.id) {
        await fetch(`http://localhost:5000/api/bookings/${editedBooking.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            petName: editedBooking.petName,
            quantity: editedBooking.quantity,
            notes: editedBooking.notes,
            total: newTotal.toFixed(2),
          }),
        });
      }

      localStorage.setItem(`cart_${user.name}`, JSON.stringify(updatedCart));
      setEditIndex(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("❌ Failed to update booking.");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + (parseFloat(item.total) || 0),
    0
  );

  const handleProceedToReview = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setShowReviewModal(true);
  };

  const handleConfirmCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("User not logged in!");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cart,
        }),
      });

      const savedBookings = await response.json();
      localStorage.setItem(`cart_${user.name}`, JSON.stringify(savedBookings));
      clearCart();
      setShowReviewModal(false);
      alert("✅ Your bookings have been confirmed. Proceeding to payment...");
      navigate("/payment");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("❌ Failed to sync with server.");
    }
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h2>
          {cart.length === 1
            ? "You have 1 booking"
            : `You have ${cart.length} bookings`}
        </h2>

        {cart.length === 0 ? (
          <p className="empty">No bookings yet.</p>
        ) : (
          <>
            <div className="bookings-list">
              {cart.map((booking, index) => (
                <div className="booking-card" key={index}>
                  <div className="booking-number">#{index + 1}</div>

                  {editIndex === index ? (
                    <>
                      <label>Pet Name:</label>
                      <input
                        type="text"
                        name="petName"
                        value={editedBooking.petName}
                        onChange={handleEditChange}
                        className="booking-input"
                      />

                      <label>Quantity:</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={editedBooking.quantity}
                        onChange={handleEditChange}
                        className="booking-input"
                      />

                      <label>Notes:</label>
                      <textarea
                        name="notes"
                        value={editedBooking.notes}
                        onChange={handleEditChange}
                        className="booking-textarea"
                      />

                      <div className="card-actions">
                        <button className="save-btn" onClick={handleSave}>
                          Save
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => setEditIndex(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Service:</strong> {booking.serviceName}</p>
                      <p><strong>Pet Name:</strong> {booking.petName || "N/A"}</p>
                      <p><strong>Quantity:</strong> {booking.quantity}</p>
                      <p><strong>Dates:</strong> {Array.isArray(booking.dates) ? booking.dates.join(", ") : "N/A"}</p>
                      <p><strong>Add-On:</strong> {booking.addOn}</p>
                      <p><strong>Notes:</strong> {booking.notes || "None"}</p>
                      <p><strong>Total:</strong> RM {booking.total}</p>
                      <p>
                        <strong>Status:</strong> 
                        <span className={`status-badge ${booking.status?.toLowerCase() || "pending"}`}>
                          {booking.status || "Pending"}
                        </span>
                      </p>

                      <div className="card-actions">
                        <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="checkout-section">
              <h3>Total: RM {total.toFixed(2)}</h3>
              <button className="checkout-btn" onClick={handleProceedToReview}>
                Checkout
              </button>
            </div>
          </>
        )}

        <div className="cart-buttons">
          <Link to="/" className="home-button">🏠 Back to Home</Link>
          <Link to="/allservices" className="home-button">🛒 Continue Booking</Link>
        </div>
      </div>

      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🧾 Confirm Your Bookings</h3>
            <ul>
              {cart.map((item, idx) => (
                <li key={idx}>
                  <strong>#{idx + 1}</strong> — {item.serviceName} for {item.petName || "N/A"} ({item.dates?.join(", ")})
                </li>
              ))}
            </ul>
            <p><strong>Total:</strong> RM {total.toFixed(2)}</p>

            <div className="modal-buttons">
              <button className="cancel" onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button className="confirm" onClick={handleConfirmCheckout}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
