import { useState } from "react";

export default function LoginPage({ onLogin, onGoSignup }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin({ email, password, role });
  };

  return (
    <div className="auth-page">
      <div className="auth-phone">
        <div className="auth-glow"></div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-logo-wrap">
            <div className="auth-logo-box">🚌</div>
          </div>

          <h1 className="auth-brand">CampusBus</h1>
          <p className="auth-tag">Live College Transport</p>

          <div className="auth-field-group">
            <label className="auth-label">EMAIL</label>
            <input
              type="email"
              className="auth-input"
              placeholder="student@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-label">PASSWORD</label>
            <input
              type="password"
              className="auth-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          

          <button type="submit" className="auth-submit-btn">
            Sign In <span>→</span>
          </button>

          <p className="auth-footer">
            Don&apos;t have an account?{" "}
            <button type="button" className="auth-link-btn" onClick={onGoSignup}>
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}