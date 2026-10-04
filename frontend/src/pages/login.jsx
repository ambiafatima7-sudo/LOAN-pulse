import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("login/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      const me = await api.get("me/");
      navigate(me.data.is_staff ? "/admin-panel" : "/loans");
    } catch {
      setError("Username ya password galat hai");
    }
  };

  return (
    <div className="auth-box">
      <h2>💰 LoanPulse</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Account nahi hai? <Link to="/register">Register karo</Link></p>
    </div>
  );
}