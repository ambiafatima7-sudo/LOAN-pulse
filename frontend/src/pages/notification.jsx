import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Notifications() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("notifications/")
      .then((res) => setItems(res.data))
      .catch(() => navigate("/"));
  }, []);

  return (
    <>
      <div className="navbar">
        <h2>🔔 Notifications</h2>
        <div className="nav-actions">
          <button className="btn btn-light" onClick={() => navigate("/loans")}>← Loans</button>
        </div>
      </div>

      <div className="container">
        {items.length === 0 && <p className="muted">Koi notification nahi hai.</p>}
        {items.map((n) => (
          <div className="card notif" key={n.id}>
            {n.message}
            <div className="muted">{new Date(n.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </>
  );
}