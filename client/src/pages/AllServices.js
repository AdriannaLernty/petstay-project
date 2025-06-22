import React, { useState, useEffect } from "react";
import ServiceCard from "../components/ServiceCard";
import "../styles/AllServices.css";
import { useNavigate } from "react-router-dom";

function AllServices({ searchQuery = "" }) {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Fetch services from backend
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  // Filter services based on search query
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="all-services">
      <h2>Our Services</h2>
      <div className="services-list">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.title}
              priceRange={`RM ${service.price_min} - RM ${service.price_max}++`}
              image={`${process.env.PUBLIC_URL}/images/${service.image_url}`}
              description={service.description}
            />
          ))
        ) : (
          <p>No services found for "{searchQuery}".</p>
        )}
      </div>

      <div className="home-button-container">
        <button className="home-button" onClick={goHome}>
          🏠 Home
        </button>
      </div>
    </div>
  );
}

export default AllServices;
