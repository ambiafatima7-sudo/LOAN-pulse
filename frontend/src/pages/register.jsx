
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "",
    phone: "", monthly_income: "", credit_score: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("register/", form);
      navigate("/login");
    } catch (err) {
      setError(JSON.stringify(err.response?.data || "Kuch galat hua"));
    }
  };

  return (
    <div className="auth-box">
      <h2>Account Banao</h2>
      <form onSubmit={handleRegister}>
        <input name="username" placeholder="Username" onChange={change} />
        <input name="email" type="email" placeholder="Email" onChange={change} />
        <input name="password" type="password" placeholder="Password (min 6 characters)" onChange={change} />
        <input name="phone" placeholder="Phone" onChange={change} />
        <input name="monthly_income" type="number" placeholder="Monthly income (₹)" onChange={change} />
        <input name="credit_score" type="number" placeholder="Credit score (300-900)" onChange={change} />
        <button className="btn" type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Account hai? <Link to="/login">Login karo</Link></p>
    </div>
  );
}