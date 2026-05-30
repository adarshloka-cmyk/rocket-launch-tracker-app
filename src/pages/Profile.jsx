import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import LaunchScopeMark from "../components/LaunchScopeMark";

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile() {
    try {
      const response = await api.get("/profile");

      setUser(response.data);
    } catch (error) {
      console.log(error);

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();

    navigate("/login");
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="ls-profile-loading">
        <div className="loading-shell__bar" aria-hidden="true" />
        <p>Loading your mission profile</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="ls-empty ls-empty--page">
        <p className="ls-empty__title">Please sign in</p>
        <Link to="/login" className="ls-btn ls-btn--primary">
          Go to login
        </Link>
      </div>
    );
  }

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const favCount = user.activeFavouritesCount ?? 0;

  return (
    <div className="ls-profile">
      <motion.section
        className="ls-operator"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="ls-operator__visual">
          <div className="ls-operator__avatar-ring" aria-hidden="true">
            <div className="ls-operator__avatar-glass">
              <span className="ls-operator__initials">{initials}</span>
            </div>
          </div>
          <LaunchScopeMark className="ls-operator__mark" size={28} />
        </div>

        <div className="ls-operator__identity">
          <span className="ls-operator__badge">Mission Control Operator</span>
          <h1 className="ls-operator__name">{user.name}</h1>
          <p className="ls-operator__email">{user.email}</p>
        </div>
      </motion.section>

      <motion.div
        className="ls-profile__layout"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        <section className="ls-profile__card ls-profile__card--highlight">
          <p className="ls-profile__card-label">Mission manifest</p>
          <div className="ls-profile__stat-hero">
            <span className="ls-profile__stat-value">{favCount}</span>
            <span className="ls-profile__stat-label">Saved missions</span>
          </div>

          <div className="ls-profile__actions">
            <Link to="/favourites" className="ls-btn ls-btn--primary">
              View saved missions
            </Link>
            <button
              type="button"
              className="ls-btn ls-btn--ghost"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </section>

        <section className="ls-profile__card" aria-label="Account details">
          <h3 className="ls-profile__card-title">Account data</h3>
          <dl className="ls-profile__dl">
            <div>
              <dt>Name</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Saved missions</dt>
              <dd>{favCount}</dd>
            </div>
          </dl>
        </section>
      </motion.div>
    </div>
  );
}
