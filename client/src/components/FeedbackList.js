import React, { useEffect, useState } from "react";

function FeedbackList({ bookingId }) {
  const [feedback, setFeedback] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchFeedback = () => {
    fetch(`http://localhost:5000/api/feedback/${bookingId}`)
      .then((res) => res.json())
      .then((data) => setFeedback(data))
      .catch((err) => console.error("Error loading feedback:", err));
  };

  useEffect(() => {
    fetchFeedback();
  }, [bookingId]);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/feedback/${id}`, {
      method: "DELETE",
    });
    fetchFeedback();
  };

  const handleEdit = async (id) => {
    await fetch(`http://localhost:5000/api/feedback/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment: editText }),
    });
    setEditId(null);
    fetchFeedback();
  };

  return (
    <div className="feedback-list">
      {feedback.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        feedback.map((fb) => (
          <div key={fb.id} className="feedback-item">
            <strong>{fb.rating} ⭐</strong>

            {editId === fb.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleEdit(fb.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p>{fb.comment}</p>
                <div className="feedback-actions">
                  <button
                    onClick={() => {
                      setEditId(fb.id);
                      setEditText(fb.comment);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(fb.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default FeedbackList;
