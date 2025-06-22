import React, { useEffect, useState } from "react";
import "../styles/PaymentHistory.css";

function PaymentHistory() {
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage", err);
      return null;
    }
  });
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!user?.id) {
    console.log("❌ User is missing or invalid:", user);
    return;
  }

  setLoading(true);

  fetch(`http://localhost:5000/api/payments/${user.id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    })
    .then((data) => {
      console.log("✅ Payments fetched:", data);
      setPayments(data);
    })
    .catch((err) => {
      console.error("❌ Fetch error:", err);
      setError("Failed to load payments. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
}, [user]);



  return (
    <div className="payment-history">
      <h2>My Payment History</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && payments.length === 0 && !error && <p>No payment records found.</p>}
      {!loading && payments.length > 0 && (
        <ul>
          {payments.map((p) => (
            <li key={p.id}>
              <strong>File:</strong>{" "}
              <a href={`http://localhost:5000/${p.file_path}`} target="_blank" rel="noopener noreferrer">
                {p.original_name}
              </a>
              <br />
              <strong>Type:</strong> {p.file_type}
              <br />
              <strong>Submitted:</strong>{" "}
              {new Date(p.submitted_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PaymentHistory;
