import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";
import "../styles/AdminServices.css";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price_min: "",
    price_max: "",
    imageFile: null,
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("❌ Failed to fetch services:", error);
    }
  };

  const handleUpdate = async (id, updatedService) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedService),
      });
      if (response.ok) {
        setMessage("✅ Service updated successfully.");
        fetchServices();
      } else {
        setMessage("❌ Failed to update service.");
      }
    } catch (err) {
      setMessage("❌ Error updating service.");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (response.ok) {
        setMessage("🗑️ Service deleted.");
        fetchServices();
      } else {
        setMessage("❌ Failed to delete service.");
      }
    } catch (err) {
      setMessage("❌ Error deleting service.");
      console.error(err);
    }
  };

  const handleAdd = async () => {
    const { title, description, price_min, price_max, imageFile } = newService;
    if (!title || !price_min || !price_max || !imageFile) {
      return alert("Please fill all required fields including image.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price_min", price_min);
    formData.append("price_max", price_max);
    formData.append("image", imageFile);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("✅ Service added successfully.");
        setNewService({
          title: "",
          description: "",
          price_min: "",
          price_max: "",
          imageFile: null,
        });
        setShowModal(false);
        fetchServices();
      } else {
        setMessage("❌ Failed to add service.");
      }
    } catch (error) {
      setMessage("❌ Error adding service.");
      console.error(error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>🛠️ Manage Services</h2>
      <button className="status-btn back-btn" onClick={() => navigate("/admin-dashboard")}>
        ← Back to Dashboard
      </button>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-services-list">
        {services.map((s) => (
          <div key={s.id} className="admin-service-card">
            <img
              src={`${process.env.PUBLIC_URL}/images/${s.image_url}`}
              alt={s.title}
              className="admin-service-image"
            />
            <div className="admin-service-details">
              <input
                value={s.title}
                onChange={(e) =>
                  setServices((prev) =>
                    prev.map((item) =>
                      item.id === s.id ? { ...item, title: e.target.value } : item
                    )
                  )
                }
              />
              <textarea
                value={s.description}
                onChange={(e) =>
                  setServices((prev) =>
                    prev.map((item) =>
                      item.id === s.id ? { ...item, description: e.target.value } : item
                    )
                  )
                }
              />
              <div className="admin-price-row">
                <input
                  type="number"
                  value={s.price_min}
                  onChange={(e) =>
                    setServices((prev) =>
                      prev.map((item) =>
                        item.id === s.id ? { ...item, price_min: e.target.value } : item
                      )
                    )
                  }
                  placeholder="Min Price"
                />
                <input
                  type="number"
                  value={s.price_max}
                  onChange={(e) =>
                    setServices((prev) =>
                      prev.map((item) =>
                        item.id === s.id ? { ...item, price_max: e.target.value } : item
                      )
                    )
                  }
                  placeholder="Max Price"
                />
              </div>
              <input
                value={s.image_url}
                onChange={(e) =>
                  setServices((prev) =>
                    prev.map((item) =>
                      item.id === s.id ? { ...item, image_url: e.target.value } : item
                    )
                  )
                }
                placeholder="Image Filename"
              />

              <div className="admin-action-buttons">
                <button className="status-btn" onClick={() => handleUpdate(s.id, s)}>💾 Save</button>
                <button className="status-btn delete-btn" onClick={() => handleDelete(s.id)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="status-btn add-btn" onClick={() => setShowModal(true)}>
        ➕ Add New Service
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>➕ Add New Service</h3>
            <input
              type="text"
              placeholder="Title"
              value={newService.title}
              onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <input
              type="number"
              placeholder="Min Price"
              value={newService.price_min}
              onChange={(e) => setNewService({ ...newService, price_min: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max Price"
              value={newService.price_max}
              onChange={(e) => setNewService({ ...newService, price_max: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewService({ ...newService, imageFile: e.target.files[0] })}
            />

            <div className="modal-actions">
              <button className="status-btn" onClick={handleAdd}>✅ Add</button>
              <button className="status-btn cancel-btn" onClick={() => setShowModal(false)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServices;
