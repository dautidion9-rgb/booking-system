import { useEffect, useState } from "react";
import "./App.css";

export default function Booking() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const res = await fetch("http://localhost:3000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setError("");

    if (!time) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);

    const res = await fetch("http://localhost:3000/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, date, time })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setName("");
    setEmail("");
    setDate("");
    setTime("");
    loadBookings();
    setLoading(false);
  };

  const timeSlots = [
    "09:00","10:00","11:00","12:00",
    "13:00","14:00","15:00","16:00"
  ];

  return (
    <div className="container">
      <h1>📅 Booking System</h1>

      <form onSubmit={submitBooking}>
        <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

        {date && (
          <div className="slots">
            {timeSlots.map(t => {
              const booked = bookings.some(b => b.date === date && b.time === t);
              return (
                <button
                  type="button"
                  key={t}
                  disabled={booked}
                  className={booked ? "slot booked" : time === t ? "slot selected" : "slot"}
                  onClick={() => setTime(t)}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

        <button disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      <h2>Upcoming bookings</h2>
      {bookings.map(b => (
        <div key={b.id} className="booking">
          {b.date} {b.time} — {b.name}
        </div>
      ))}
    </div>
  );
}
