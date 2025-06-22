import React from "react";
import "../styles/LandingPage.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">
          🐾 PETSTAY: EASY BOOKING & CARE FOR YOUR PETS
        </h1>
        <p className="landing-subtitle">
          PetStay offers reliable pet care services, including grooming, wellness, 
          and secure boarding, to keep your pets happy and healthy.
          Our knowledgeable staff ensures your pets receive the love they need~
        </p>
        <div className="landing-buttons">
          <button
            className="booking-button"
            onClick={() => navigate("/allservices")}
          >
            🏠 Book Your Service Now
          </button>
          <button
            className="services-button"
            onClick={() => navigate("/allservices")}
          >
            🐾 See All Services
          </button>
        </div>
      </div>
      <div className="landing-image-container">
        <img
          src="/images/Pet_Hotel_Landing.png"
          alt="Pet Boarding"
          className="landing-image"
        />
      </div>
    </div>
  );
};

export default LandingPage;