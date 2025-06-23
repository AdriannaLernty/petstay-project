import React, { useState } from "react";
import "../styles/PaymentPage.css";

function PaymentPage() {
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setFileName(uploadedFile?.name || "");
    setPreviewUrl(URL.createObjectURL(uploadedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("❌ Please upload your payment proof (image or PDF).");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
      alert("Please log in first.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);
    formData.append("userId", user.id);
    formData.append("bookingIds", "manual_upload");

    try {
      const response = await fetch("http://localhost:5000/api/payments/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setPreviewUrl(`/uploads/payments/${result.fileName}`);
      } else {
        alert("❌ Upload failed: " + result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("❌ Something went wrong while uploading.");
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Payment</h2>

        <div className="payment-instructions">
          <p>Please complete your payment using the QR code or the bank details below:</p>

          <img src="/images/QR_code.png" alt="Payment QR Code" className="qr-code" />
          <p><strong>Bank:</strong> Maybank</p>
          <p><strong>Account Name:</strong> PetStay HQ</p>
          <p><strong>Account No.:</strong> 1234567890</p>
          <p className="upload-note">You may upload a <strong>photo or PDF</strong> as payment proof.</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <label htmlFor="proof">Upload Payment Proof:</label>
          <input
            type="file"
            id="proof"
            accept="image/*,.pdf"
            onChange={handleFileChange}
          />
          {fileName && <p className="file-name">Selected: {fileName}</p>}
          <button type="submit">Submit Payment Proof</button>
        </form>

        {submitted && (
          <div className="thank-you">
            <p>✅ Payment proof submitted successfully!</p>
            {previewUrl && previewUrl.endsWith(".pdf") ? (
              <p>
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  View uploaded PDF
                </a>
              </p>
            ) : (
              <img src={previewUrl} alt="Preview" className="payment-preview" />
            )}
            <p>Our team will verify your payment and issue your booking invoice shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;
