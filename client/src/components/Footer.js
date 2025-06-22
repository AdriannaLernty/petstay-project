import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <p>Contact Us</p>
      <div className="social-icons">
        <a href="#"><FaWhatsapp /></a>
        <a href="#"><FaFacebook /></a>
        <a hrefL="#"><FaInstagram /></a>
      </div>
    </footer>
  );
};

export default Footer;