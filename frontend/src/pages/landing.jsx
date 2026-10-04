import { useState } from "react";
import { Link } from "react-router-dom";

function calcEmi(p, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (r === 0) return p / months;
  return (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function Landing() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(24);

  const emi = calcEmi(amount, rate, months);
  const total = emi * months;
  const interest = total - amount;
  const principalPct = Math.round((amount / total) * 100);

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="l-nav">
        <div className="l-logo">💰 Loan<span>Pulse</span></div>
        <nav className="l-links">
          <a href="#features">Features</a>
          <a href="#calculator">EMI Calculator</a>
          <a href="#steps">How it works</a>
        </nav>
        <div className="l-nav-btns">
          <Link to="/login" className="btn-outline">Login</Link>
          <Link to="/register" className="btn-solid">Apply Now</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <span className="pill">⚡ 100% Digital • Instant Decision</span>
          <h1>Get Loans up to <span className="grad">₹10 Lakh</span> in Minutes</h1>
          <p>
            Low interest rates, smart risk assessment, transparent EMI and
            zero paperwork. Apply online and track every payment in one place.
          </p>
          <div className="hero-btns">
            <Link to="/register" className="btn-solid big">Apply for Loan →</Link>
            <a href="#calculator" className="btn-outline big">Calculate EMI</a>
          </div>
          <div className="trust">
            <div><b>10K+</b><span>Happy customers</span></div>
            <div><b>10.5%</b><span>Starting rate p.a.</span></div>
            <div><b>24 hrs</b><span>Fast disbursal</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="float-card fc1">
            <small>Loan Approved ✅</small>
            <b>₹5,00,000</b>
          </div>
          <div className="float-card fc2">
            <small>Monthly EMI</small>
            <b>₹23,537</b>
          </div>
          <div className="float-card fc3">
            <small>Risk Score</small>
            <b style={{ color: "#16a34a" }}>Low (25)</b>
          </div>
          <div className="hero-circle">💳</div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section">
        <h2 className="s-title">Why choose <span className="grad">LoanPulse</span>?</h2>
        <p className="s-sub">Everything you need to borrow smartly and repay easily</p>
        <div className="grid4">
          {[
            ["⚡", "Instant Approval", "Automated risk assessment gives you a quick decision."],
            ["📉", "Low Interest", "Competitive rates starting from 10.5% per annum."],
            ["🔒", "Secure & Safe", "JWT-secured accounts and encrypted data handling."],
            ["📅", "Easy EMI Tracking", "See every due date and pay EMIs with one click."],
            ["🔔", "Smart Alerts", "Get notified on every status change and EMI due."],
            ["📊", "Risk Insights", "Understand your risk score: Low, Medium or High."],
            ["📝", "Zero Paperwork", "Complete application online in a few minutes."],
            ["🤝", "Transparent Terms", "No hidden charges. What you see is what you pay."],
          ].map(([icon, title, text]) => (
            <div className="feature" key={title}>
              <div className="f-icon">{icon}</div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMI CALCULATOR */}
      <section id="calculator" className="section alt">
        <h2 className="s-title">EMI <span className="grad">Calculator</span></h2>
        <p className="s-sub">Plan your loan before you apply</p>
        <div className="calc">
          <div className="calc-left">
            <div className="slider-row">
              <label>Loan Amount <b>{inr(amount)}</b></label>
              <input type="range" min="50000" max="1000000" step="10000"
                value={amount} onChange={(e) => setAmount(+e.target.value)} />
            </div>
            <div className="slider-row">
              <label>Interest Rate <b>{rate}% p.a.</b></label>
              <input type="range" min="8" max="24" step="0.5"
                value={rate} onChange={(e) => setRate(+e.target.value)} />
            </div>
            <div className="slider-row">
              <label>Tenure <b>{months} months</b></label>
              <input type="range" min="6" max="60" step="1"
                value={months} onChange={(e) => setMonths(+e.target.value)} />
            </div>
          </div>

          <div className="calc-right">
            <div className="emi-big">
              <small>Your monthly EMI</small>
              <h3>{inr(emi)}</h3>
            </div>
            <div className="bar">
              <div className="bar-p" style={{ width: `${principalPct}%` }} />
            </div>
            <div className="legend">
              <span><i className="dot d1" /> Principal {inr(amount)}</span>
              <span><i className="dot d2" /> Interest {inr(interest)}</span>
            </div>
            <div className="total-row">
              <span>Total payable</span><b>{inr(total)}</b>
            </div>
            <Link to="/register" className="btn-solid big full">Apply for this loan</Link>
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section id="steps" className="section">
        <h2 className="s-title">Get your loan in <span className="grad">4 easy steps</span></h2>
        <p className="s-sub">Simple, fast and completely online</p>
        <div className="steps">
          {[
            ["1", "Register", "Create your account with income and credit score."],
            ["2", "Apply", "Choose amount and tenure. Get an instant risk score."],
            ["3", "Approval", "Our team reviews and approves your application."],
            ["4", "Disbursal & EMI", "Receive funds and pay EMIs easily online."],
          ].map(([n, t, d]) => (
            <div className="step" key={n}>
              <div className="step-no">{n}</div>
              <h4>{t}</h4>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to get started?</h2>
        <p>Apply now and get your loan decision in minutes.</p>
        <Link to="/register" className="btn-white">Apply Now →</Link>
      </section>

      {/* FOOTER */}
      <footer className="l-footer">
        <div className="l-logo light">💰 Loan<span>Pulse</span></div>
        <p>© 2026 LoanPulse. Loan Management System • React + Django</p>
      </footer>
    </div>
  );
}