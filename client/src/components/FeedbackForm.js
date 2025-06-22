import React, { useState } from "react";

function FeedbackForm({ bookingId, onFeedbackSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: bookingId, rating, comment }),
      });

      if (res.ok) {
        setComment("");
        setRating(5);
        onFeedbackSubmitted(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <label>Rating:</label>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience"
      />

      <button type="submit">Submit Feedback</button>
    </form>
  );
}

export default FeedbackForm;
