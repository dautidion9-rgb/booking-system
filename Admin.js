import { useState } from "react";


export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const login = async () => {
    const res = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      setError("Login failed");
      return;
    }

    setLoggedIn(true);
    loadBookings();
  };

  const loadBookings = async () => {
    const res = await fetch("http://localhost:3000/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  if (!loggedIn) {
    return (
      <div className="container">
        <h2>Admin Login</h2>
        <input placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button onClick={login}>Login</button>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {bookings.map(b => (
        <div key={b.id} className="booking">
          {b.date} {b.time} — {b.name} ({b.email})
        </div>
      ))}
    </div>
  );
}
