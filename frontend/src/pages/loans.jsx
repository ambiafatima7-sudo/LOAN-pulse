
  import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function riskInfo(score) {
  if (score === null || score === undefined) return { label: "-", cls: "" };
  if (score < 35) return { label: `Low (${score})`, cls: "risk-Low" };
  if (score < 65) return { label: `Medium (${score})`, cls: "risk-Medium" };
  return { label: `High (${score})`, cls: "risk-High" };
}

const inr = (n) => "₹" + Math.round(Number(n)).toLocaleString("en-IN");

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ amount: "", tenure_months: "", purpose: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const loadLoans = async () => {
    try {
      const res = await api.get("loans/");
      setLoans(res.data);
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const applyLoan = async (e) => {
    e.preventDefault();
    try {
      await api.post("loans/", form);
      setMsg("Loan apply ho gaya!");
      setForm({ amount: "", tenure_months: "", purpose: "" });
      loadLoans();
    } catch (err) {
      setMsg(JSON.stringify(err.response?.data || "Kuch galat hua"));
    }
  };

  const payEmi = async (id) => {
    await api.post(`repayments/${id}/pay/`);
    loadLoans();
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // summary numbers
  const allEmis = loans.flatMap((l) => l.repayments);
  const paidCount = allEmis.filter((r) => r.paid).length;
  const pendingCount = allEmis.length - paidCount;
  const totalBorrowed = loans
    .filter((l) => l.status === "DISBURSED")
    .reduce((s, l) => s + Number(l.amount), 0);

  return (
    <div className="dash">
      <div className="navbar">
        <h2>💰 LoanPulse</h2>
        <div className="nav-actions">
          <button className="btn btn-light" onClick={() => navigate("/notifications")}>🔔 Notifications</button>
          <button className="btn btn-light" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="container wide">
        <div className="stats">
          <div className="stat s1"><span>📄</span><div><small>Total Loans</small><b>{loans.length}</b></div></div>
          <div className="stat s2"><span>💵</span><div><small>Amount Borrowed</small><b>{inr(totalBorrowed)}</b></div></div>
          <div className="stat s3"><span>✅</span><div><small>EMIs Paid</small><b>{paidCount}</b></div></div>
          <div className="stat s4"><span>⏳</span><div><small>EMIs Pending</small><b>{pendingCount}</b></div></div>
        </div>

        <div className="card">
          <h3>Naya Loan Apply Karo</h3>
          <form onSubmit={applyLoan} className="apply-form">
            <input name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={change} />
            <input name="tenure_months" type="number" placeholder="Tenure (months)" value={form.tenure_months} onChange={change} />
            <input name="purpose" placeholder="Purpose" value={form.purpose} onChange={change} />
            <button className="btn" type="submit">Apply</button>
          </form>
        </div>

        {msg && <div className="msg">{msg}</div>}

        <h3>Mere Loans</h3>
        {loans.length === 0 && <p className="muted">Abhi koi loan nahi hai.</p>}
        {loans.map((loan) => {
          const risk = riskInfo(loan.risk_score);
          const paid = loan.repayments.filter((r) => r.paid).length;
          const total = loan.repayments.length;
          const pct = total ? Math.round((paid / total) * 100) : 0;
          return (
            <div className="card" key={loan.id}>
              <div className="loan-head">
                <div>
                  <div className="loan-amount">{inr(loan.amount)}</div>
                  <div className="muted">Loan #{loan.id} • {loan.tenure_months} months • {loan.purpose}</div>
                </div>
                <span className={`badge badge-${loan.status}`}>{loan.status}</span>
              </div>
              <p>Risk: <span className={risk.cls}>{risk.label}</span></p>

              {total > 0 && (
                <>
                  <div className="muted">Repayment progress: {paid}/{total} EMIs ({pct}%)</div>
                  <div className="progress"><div style={{ width: `${pct}%` }} /></div>
                  <table>
                    <thead>
                      <tr><th>Due date</th><th>EMI</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {loan.repayments.map((r) => (
                        <tr key={r.id}>
                          <td>{r.due_date}</td>
                          <td>{inr(r.emi_amount)}</td>
                          <td>
                            {r.paid ? "Paid ✅" : <button className="btn btn-green btn-sm" onClick={() => payEmi(r.id)}>Pay</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}