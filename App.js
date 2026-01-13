import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Booking from "./Booking";
import Admin from "./Admin";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ textAlign: "center", marginBottom: 20 }}>
        <Link to="/" style={{ marginRight: 15 }}>Booking</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
