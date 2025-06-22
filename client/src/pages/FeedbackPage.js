import React, { useEffect, useState } from "react";
import "../styles/FeedbackPage.css";

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching feedback:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="feedback-page">
      <h2>What Our Customers Are Saying</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : feedbacks.length === 0 ? (
        <p>No feedback available yet.</p>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <p className="feedback-rating">⭐ {fb.rating} Stars</p>
              <p className="feedback-text">"{fb.comment}"</p>
              <p className="feedback-meta">
                <span>Service: {fb.service}</span>
                <span>Pet: {fb.pet_name}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FeedbackPage;
