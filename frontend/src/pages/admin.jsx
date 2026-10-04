import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function riskLabel(score) {
  if (score === null || score === undefined) return "-";
  if (score < 35) return `Low (${score})`;
  if (score < 65) return `Medium (${score})`;
  return `High (${score})`;
}

export default function Admin() {
  const [loans, setLoans] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("loans/");
      setLoans(res.data);
    } catch {
      navigate("/");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (id, decision) => {
    try {
      await api.post(`loans/${id}/decide/`, { decision });
      setMsg(`Loan #${id} ${decision} ho gaya`);
      load();
    } catch (err) {
      setMsg(JSON.stringify(err.response?.data || "Error"));
    }
  };

  const disburse = async (id) => {
    try {
      const res = await api.post(`loans/${id}/disburse/`);
      setMsg(`Loan #${id} disburse ho gaya. EMI: ₹${res.data.emi}`);
      load();
    } catch (err) {
      setMsg(JSON.stringify(err.response?.data || "Error"));
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: 800, margin: "30px auto", padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      {msg && <p><b>{msg}</b></p>}

      {loans.length === 0 && <p>Koi loan nahi hai.</p>}
      {loans.map((loan) => (
        <div key={loan.id} style={{ border: "1px solid #888", borderRadius: 6, padding: 12, margin: "12px 0" }}>
          <b>Loan #{loan.id}</b> — ₹{loan.amount} ({loan.tenure_months} months)
          <br />
          Status: <b>{loan.status}</b> | Risk: {riskLabel(loan.risk_score)}
          <br />
          Purpose: {loan.purpose}
          <br />
          {(loan.status === "REVIEW" || loan.status === "SUBMITTED") && (
            <>
              <button onClick={() => decide(loan.id, "approve")}>Approve</button>{" "}
              <button onClick={() => decide(loan.id, "reject")}>Reject</button>
            </>
          )}
          {loan.status === "APPROVED" && (
            <button onClick={() => disburse(loan.id)}>Disburse</button>
          )}
        </div>
      ))}
    </div>
  );
}