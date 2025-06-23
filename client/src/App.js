import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminHeader from "./components/AdminHeader";
import AdminFooter from "./components/AdminFooter";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import BookingPage from "./pages/BookingPage";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AllServices from "./pages/AllServices";
import SearchResult from "./pages/SearchResult";
import Cart from "./pages/Cart";
import MyBookings from "./pages/MyBookings";
import FeedbackPage from "./pages/FeedbackPage";
import AboutPage from "./pages/AboutPage";
import PaymentPage from "./pages/PaymentPage";
import { CartProvider } from "./context/CartContext";
import PaymentHistory from "./pages/PaymentHistory";
import AdminBookings from "./pages/AdminBookings";
import AdminServices from "./pages/AdminServices";

function LayoutWrapper() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminPage ? <AdminHeader /> : <Header />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/allservices" element={<AllServices />} />
        <Route path="/booking/:serviceName" element={<BookingPage />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-history" element={<PaymentHistory />} />
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-services"
          element={
            <AdminRoute>
              <AdminServices />
            </AdminRoute>
          }
        />
      </Routes>

      {isAdminPage ? <AdminFooter /> : <Footer />}
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="250052639234-a5tap4d46aj2sdsvhnsuisoig7ucs3b0.apps.googleusercontent.com">
      <CartProvider>
        <Router>
          <LayoutWrapper />
        </Router>
      </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
