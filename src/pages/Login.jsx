import api from "../api/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      login(response.data.user, response.data.token);

      alert("Login successful");

      navigate("/");
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message || "Server Error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ls-auth">
      <motion.aside
        className="ls-auth__brand"
        initial={prefersReducedMotion ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="ls-auth__brand-eyebrow">LAUNCHSCOPE</p>
        <h1 className="ls-auth__brand-title">
          Track Humanity&apos;s Next Launch.
        </h1>
        <p className="ls-auth__brand-text">
          Sign in to save missions, monitor countdowns, and access your
          operator dashboard.
        </p>
      </motion.aside>

      <motion.div
        className="ls-auth__panel"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <form className="ls-auth__form" onSubmit={handleLogin}>
          <h2 className="ls-auth__form-title">Welcome back</h2>
          <p className="ls-auth__form-sub">
            Login to continue tracking launches.
          </p>

          {error && (
            <p className="ls-auth__error" role="alert">
              {error}
            </p>
          )}

          <label className="ls-field">
            <span className="ls-field__label">Email</span>
            <input
              type="email"
              placeholder="you@mission.control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label className="ls-field">
            <span className="ls-field__label">Password</span>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className="ls-btn ls-btn--primary ls-btn--full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>

          <p className="ls-auth__switch">
            No account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
