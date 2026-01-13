const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// database
const db = new sqlite3.Database("./bookings.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      date TEXT,
      time TEXT
    )
  `);
});

// routes
app.get("/api/bookings", (req, res) => {
  db.all("SELECT * FROM bookings ORDER BY date, time", (err, rows) => {
    res.json(rows);
  });
});

app.post("/api/book", (req, res) => {
  const { name, email, date, time } = req.body;

  db.get(
    "SELECT * FROM bookings WHERE date = ? AND time = ?",
    [date, time],
    (err, existing) => {
      if (existing) {
        return res.status(400).json({ error: "Time slot already booked" });
      }

      db.run(
        "INSERT INTO bookings (name, email, date, time) VALUES (?, ?, ?, ?)",
        [name, email, date, time],
        () => res.json({ success: true })
      );
    }
  );
});

// admin login (simple)
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
