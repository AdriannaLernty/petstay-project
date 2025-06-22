import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaShoppingCart } from "react-icons/fa";
import { FiUser, FiList, FiLogOut, FiFileText } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { cart } = useCart();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
    }
  };

  // ✅ Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="logo">PetStay</div>

      <nav className="nav">
        <Link to="/about">About Us</Link>
        <Link to="/feedback">Feedback</Link>
        <Link to="/allservices">Services</Link>

        {/* 🔍 Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <FaSearch />
          </button>
        </form>

        {/* 🛒 Cart */}
        <Link to="/cart" className="cart-link">
          <FaShoppingCart /> Cart
          {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </Link>

        {/* 👤 Profile Dropdown */}
        {user ? (
          <div
            className="profile-section"
            onClick={toggleDropdown}
            ref={dropdownRef}
          >
            <FaUserCircle className="profile-icon" />
            <span className="username">Welcome, {user.name}</span>
            {dropdownOpen && (
              <div className="profile-dropdown animate-dropdown">
                <Link to="/profile">
                  <FiUser /> &nbsp; Profile
                </Link>
                <Link to="/my-bookings">
                  <FiList /> &nbsp; My Bookings
                </Link>
                <Link to="/payment-history">
                  <FiFileText /> &nbsp; Payment History
                </Link>
                <button onClick={handleLogout}>
                  <FiLogOut /> &nbsp; Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
