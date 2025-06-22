import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Live password checks
  const isLengthValid = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword;

  const isPasswordValid = isLengthValid && hasUppercase && hasNumber && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.message === "User registered successfully") {
        localStorage.setItem("user", JSON.stringify({ name, email }));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="password-checklist">
          <p className={isLengthValid ? "valid" : "invalid"}>✔ Minimum 8 characters</p>
          <p className={hasUppercase ? "valid" : "invalid"}>✔ At least 1 uppercase letter</p>
          <p className={hasNumber ? "valid" : "invalid"}>✔ At least 1 number</p>
        </div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {!passwordsMatch && <p className="invalid">❌ Passwords do not match</p>}
        <button type="submit" disabled={!isPasswordValid}>Register Now</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
