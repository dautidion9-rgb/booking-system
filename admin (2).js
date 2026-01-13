import { useState, useEffect } from "react";
import "./App.css";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const loginAdmin = async () => {
    const res = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login)
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    setLoggedIn(true);
  };

  useEffect(() => {
    if (loggedIn) {
      fetch("http://localhost:3000/api/bookings")
        .then(res => res.json())
        .then(setBookings);
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="container">
        <h1>🔐 Admin Login</h1>
        <input placeholder="Username" onChange={e => setLogin({ ...login, username: e.target.value })} />
        <input type="password" placeholder="Password" onChange={e => setLogin({ ...login, password: e.target.value })} />
        <button onClick={loginAdmin}>Login</button>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>📋 Admin Dashboard</h1>
      {bookings.map(b => (
        <div key={b.id} className="booking">
          {b.date} {b.time} — {b.name} ({b.email})
        </div>
      ))}
    </div>
  );
}
