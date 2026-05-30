import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import LaunchScopeMark from "./LaunchScopeMark";

function scrollToHero() {
  const hero = document.getElementById("hero");
  if (hero) {
    hero.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function HomeLink({ className, onNavigate }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  function handleClick(e) {
    if (isHome) {
      e.preventDefault();
      scrollToHero();
      onNavigate?.();
    }
  }

  return (
    <NavLink
      to="/"
      end
      className={className}
      onClick={handleClick}
    >
      Home
    </NavLink>
  );
}

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinks = [
    { type: "home", label: "Home" },
    { to: "/favourites", label: "Favourites" },
    { to: "/profile", label: "Profile" },
  ];

  const authLinks = user
    ? []
    : [
        { to: "/login", label: "Login" },
        { to: "/signup", label: "Sign up" },
      ];

  function handleBrandClick(e) {
    if (location.pathname === "/") {
      e.preventDefault();
      scrollToHero();
    }
  }

  return (
    <>
      <motion.header
        className={`ls-navbar ${scrolled ? "ls-navbar--scrolled" : ""}`}
        initial={prefersReducedMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="ls-navbar__inner">
          <Link
            to="/"
            className="ls-navbar__brand"
            aria-label="LAUNCH SCOPE home"
            onClick={handleBrandClick}
          >
            <LaunchScopeMark className="ls-navbar__logo" size={36} />
            <span className="ls-navbar__brand-text">
              <span className="ls-navbar__brand-name">LAUNCH SCOPE</span>
              <span className="ls-navbar__brand-tag">Mission Control</span>
            </span>
          </Link>

          <nav className="ls-navbar__links" aria-label="Main navigation">
            {navLinks.map((item) =>
              item.type === "home" ? (
                <HomeLink
                  key="home"
                  className={({ isActive }) =>
                    `ls-navbar__link ${isActive ? "ls-navbar__link--active" : ""}`
                  }
                />
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `ls-navbar__link ${isActive ? "ls-navbar__link--active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
            {authLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `ls-navbar__link ${isActive ? "ls-navbar__link--active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ls-navbar__actions">
            {user && (
              <div className="ls-navbar__user" title={user.email}>
                <span className="ls-navbar__user-avatar" aria-hidden="true">
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </span>
                <span className="ls-navbar__user-name">{user.name}</span>
              </div>
            )}

            {user && (
              <button
                type="button"
                className="ls-navbar__logout"
                onClick={onLogout}
              >
                Logout
              </button>
            )}

            <button
              type="button"
              className="ls-navbar__menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="ls-mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <span className={`ls-navbar__menu-icon ${mobileOpen ? "is-open" : ""}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="ls-navbar__backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              id="ls-mobile-nav"
              className="ls-navbar__mobile"
              initial={prefersReducedMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={prefersReducedMotion ? undefined : { x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              aria-label="Mobile navigation"
            >
              <p className="ls-navbar__mobile-label">Navigation</p>
              <HomeLink
                className={({ isActive }) =>
                  `ls-navbar__mobile-link ${isActive ? "ls-navbar__mobile-link--active" : ""}`
                }
                onNavigate={() => setMobileOpen(false)}
              />
              {navLinks
                .filter((item) => item.type !== "home")
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `ls-navbar__mobile-link ${isActive ? "ls-navbar__mobile-link--active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              {authLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `ls-navbar__mobile-link ${isActive ? "ls-navbar__mobile-link--active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              {user && (
                <button
                  type="button"
                  className="ls-navbar__mobile-logout"
                  onClick={onLogout}
                >
                  Logout
                </button>
              )}
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
