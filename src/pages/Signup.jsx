import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";

export default function Signup() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", formData);

      const data = response.data;

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Signup failed 🚀"
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
          Join Launch Intelligence.
        </h1>
        <p className="ls-auth__brand-text">
          Create an account to track launches worldwide and build your
          mission watchlist.
        </p>
      </motion.aside>

      <motion.div
        className="ls-auth__panel"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      >
        <form className="ls-auth__form" onSubmit={handleSubmit}>
          <h2 className="ls-auth__form-title">Create account</h2>
          <p className="ls-auth__form-sub">
            Join the rocket launch tracking platform.
          </p>

          <label className="ls-field">
            <span className="ls-field__label">Full name</span>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>

          <label className="ls-field">
            <span className="ls-field__label">Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@mission.control"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label className="ls-field">
            <span className="ls-field__label">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            className="ls-btn ls-btn--primary ls-btn--full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="ls-auth__switch">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
