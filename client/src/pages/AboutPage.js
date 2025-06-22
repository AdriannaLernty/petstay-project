import React from "react";
import "../styles/AboutPage.css";

function AboutPage() {
  return (
    <div className="about-container">
      <h2>About PetStay</h2>
      <p>
        PetStay is a user-friendly web-based platform designed to simplify pet boarding services.
        Whether you're a loving pet owner looking for trusted care or planning ahead for a trip,
        PetStay helps you book and manage services effortlessly.
      </p>

      <h3>What We Offer</h3>
      <ul>
        <li>Easy service booking with transparent pricing</li>
        <li>Manage your pet profiles and preferences in one place</li>
        <li>Track your booking status and get email confirmations</li>
        <li>Leave feedback to help improve pet care experiences</li>
      </ul>

      <h3>Our Mission</h3>
      <p>
        We aim to bridge the gap between pet owners and pet service providers through technology,
        ensuring every furry friend receives the love and care they deserve.
      </p>

      <h3>Contact Us</h3>
      <p className="contact-info">
        Email: <a href="mailto:support@petstay.com">support@petstay.com</a> | 
        Phone: <a href="tel:+60123456789">+60 12-345 6789</a>
      </p>
    </div>
  );
}

export default AboutPage;
