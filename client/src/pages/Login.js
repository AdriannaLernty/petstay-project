import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Login.css";
import { GoogleLogin } from '@react-oauth/google';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle normal login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.message === "Login successful") {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        if (data.user.role === "admin") {
          navigate("/admin-dashboard");  // redirect to admin page
        } else {
          navigate("/");  // redirect to landing page
        }
        
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.user) {
        console.log("🧪 Logged in user from Google:", data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        if (data.user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
      setMessage("Google login failed. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <div className="google-login-section" style={{ marginTop: "20px" }}>
          <p>or</p>
          <GoogleLogin
            onSuccess={async (response) => {
              if (!response.credential) {
                setMessage("Google login failed.");
                return;
              }

              try {
                const res = await fetch("http://localhost:5000/api/auth/google-login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ token: response.credential }),
                });

                const data = await res.json();
                setMessage(data.message);

                if (data.user) {
                  localStorage.setItem("user", JSON.stringify(data.user));
                  localStorage.setItem("token", data.token);
                  navigate("/");
                }
              } catch (err) {
                console.error("Google login error:", err);
                setMessage("Google login failed. Please try again.");
              }
            }}
            onError={() => {
              setMessage("Google Login Failed");
            }}
          />


        </div>

        {message && <p>{message}</p>}
      </div>
    </Layout>
  );
}

export default Login;
