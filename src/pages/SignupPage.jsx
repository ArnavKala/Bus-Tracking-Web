import { useState } from "react";

export default function SignupPage({ onGoLogin, onSignup }) {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSignup) onSignup({ name, gmail, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-phone">
        <div className="auth-glow"></div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-logo-wrap">
            <div className="auth-logo-box">🚌</div>
          </div>

          <h1 className="auth-brand">Create Account</h1>
          <p className="auth-tag">Sign up for CampusBus</p>

          <div className="auth-field-group">
            <label className="auth-label">NAME</label>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-label">GMAIL</label>
            <input
              type="email"
              className="auth-input"
              placeholder="Enter your gmail"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-label">PASSWORD</label>
            <input
              type="password"
              className="auth-input"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign Up <span>→</span>
          </button>

          <p className="auth-footer">
            Already have an account?{" "}
            <button type="button" className="auth-link-btn" onClick={onGoLogin}>
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}