import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceCard.css";

function ServiceCard({ name, priceRange, image, description }) {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/booking/${name.toLowerCase()}`);
  };

  return (
    <div className="service-card">
      <div className="service-image-container">
        <img src={image} alt={name} className="service-image" />
      </div>
      <div className="service-details">
        <h3>{name}</h3>
        <p className="price">{priceRange}</p>
        <p className="description">{description}</p>
        <button className="booking-button" onClick={handleBooking}>
          See Availabilities
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;