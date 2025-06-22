import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookingPage.css";
import { useCart } from "../context/CartContext";

function BookingPage() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { addToCart } = useCart();

  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState("None");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [petName, setPetName] = useState("");
  const [notes, setNotes] = useState("");
  const [petList, setPetList] = useState([]);
  const [slotInfo, setSlotInfo] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const serviceDetails = {
    boarding: {
      name: "Boarding",
      priceRange: "RM 32 - RM 160++",
      image: `${process.env.PUBLIC_URL}/images/Pet_Boarding.png`,
      description: `📌 Accommodation: Safe and cosy spaces.\n🍽️ Care: Personalized attention and regular feeding.\n🧸 Activities: Daily playtime and cuddles.\n⏳ Duration: Overnight stays or extended vacations.\n❤️ Peace of Mind: Experienced and loving caregivers.`,
      basePrice: 32,
      addOns: [
        { name: "Grooming and Bath", price: 50 },
        { name: "Special Meal Plan", price: 30 },
      ],
    },
    grooming: {
      name: "Grooming",
      priceRange: "RM 40 - RM 90++",
      image: `${process.env.PUBLIC_URL}/images/Pet_Grooming.png`,
      description: `✂️ Service: Professional grooming and bath.\n💧 Safety: Gentle and pet-friendly grooming techniques.\n⏳ Duration: Varies based on pet size and service.\n❤️ Peace of Mind: Handled by experienced groomers.`,
      basePrice: 40,
      addOns: [
        { name: "Nail Trimming", price: 15 },
        { name: "Fur Styling", price: 20 },
      ],
    },
  };

  const service = serviceDetails[serviceName?.toLowerCase()] || serviceDetails.boarding;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const toggleDay = (day) => {
    const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (selectedDays.includes(dayStr)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayStr));
    } else {
      setSelectedDays([...selectedDays, dayStr]);
    }
  };

  const calculateTotal = () => {
    const base = service.basePrice;
    const addOnPrice = selectedAddOn === "None" ? 0 : parseInt(selectedAddOn.match(/\d+/)[0]);
    const daysTotal = selectedDays.length * base;
    setTotalPrice((daysTotal + addOnPrice) * quantity);
  };

  useEffect(() => {
    calculateTotal();
  }, [selectedDays, selectedAddOn, quantity]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      fetch(`http://localhost:5000/api/profile/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.pets)) {
            setPetList(data.pets);
          }
        });
    }
  }, []);

  useEffect(() => {
    const sName = service.name;
    fetch(`http://localhost:5000/api/slots?serviceName=${sName}`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.forEach((item) => {
          map[item.date] = item.available_slots;
        });
        setSlotInfo(map);
      });
  }, [service.name]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddToCart = () => {
    if (selectedDays.length === 0) {
      alert("❗ Please select at least one date.");
      return;
    }
    if (!petName) {
      alert("❗ Please select a pet name.");
      return;
    }

    const booking = {
      serviceName: service.name,
      dates: selectedDays,
      addOn: selectedAddOn,
      quantity,
      petName,
      notes,
      total: totalPrice,
    };

    addToCart(booking);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2500);

    // reset form
    setSelectedDays([]);
    setSelectedAddOn("None");
    setQuantity(1);
    setPetName("");
    setNotes("");
  };

  return (
    <div className="booking-page-wrapper">
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-left">
            <img src={service.image} alt={service.name} className="booking-image" />
            <h2>{service.name}</h2>
            <p className="price-range">{service.priceRange}</p>
            <p className="description">{service.description}</p>
          </div>

          <div className="booking-right">
            <h3>
              Availability for{" "}
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h3>

            <div className="calendar-controls">
              <button onClick={goToPrevMonth}>◀</button>
              <button onClick={goToNextMonth}>▶</button>
            </div>

            <div className="calendar-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div className="weekday-label" key={day}>{day}</div>
              ))}
            </div>

            <div className="calendar">
              {/* Empty slots before day 1 */}
              {(() => {
                const firstDay = new Date(currentYear, currentMonth, 1);
                const pad = (firstDay.getDay() + 6) % 7;
                return Array(pad).fill(null).map((_, i) => <div key={`pad-${i}`} className="day empty"></div>);
              })()}

              {[...Array(daysInMonth).keys()].map((d) => {
                const day = d + 1;
                const fullDate = new Date(currentYear, currentMonth, day);
                const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isPast = fullDate < tomorrow;
                const isFull = slotInfo[dayStr] === 0;
                const isDisabled = isPast || isFull;

                return (
                  <div
                    key={day}
                    className={`day ${selectedDays.includes(dayStr) ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                    onClick={() => !isDisabled && toggleDay(day)}
                  >
                    {day}
                    {!isPast && (
                      <div className="slot-text">
                        {isFull ? "Full" : `${slotInfo[dayStr] ?? 5} slots`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <p>Days selected: {selectedDays.length} days</p>

            <label>Add On Service:</label>
            <select value={selectedAddOn} onChange={(e) => setSelectedAddOn(e.target.value)}>
              <option value="None">None</option>
              {service.addOns.map((addOn, i) => (
                <option key={i} value={`${addOn.name} (RM ${addOn.price})`}>
                  {addOn.name} (RM {addOn.price})
                </option>
              ))}
            </select>

            <label>Pet Name:</label>
            <select
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="booking-input"
            >
              <option value="">-- Select your pet --</option>
              {petList.map((pet) => (
                <option key={pet.id} value={pet.name}>
                  {pet.name}
                </option>
              ))}
            </select>

            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="booking-input"
            />

            <label>Notes:</label>
            <textarea
              placeholder="Any special instructions?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="booking-textarea"
            />

            <div className="price-section">
              <p>Total: <span>RM {totalPrice}</span></p>
            </div>

            <button className="add-to-cart-button" onClick={handleAddToCart}>
              Add to Cart
            </button>

            {showConfirmation && (
              <p style={{ color: "green", marginTop: "10px" }}>✅ Booking added to cart!</p>
            )}
          </div>
        </div>

        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate("/allservices")}>
            ⬅️ Back to All Services
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
