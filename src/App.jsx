import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import toast from "react-hot-toast";

import api from "./api/api";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Favourites from "./pages/Favourites";
import LaunchDetails from "./pages/LaunchDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import SkeletonCard from "./components/SkeletonCard";
import Navbar from "./components/Navbar";

import { useAuth } from "./context/AuthContext";

import "./App.css";

const FOOTER_SPACE_RESOURCES = [
  { label: "SpaceX", href: "https://www.spacex.com" },
  { label: "NASA", href: "https://www.nasa.gov" },
  { label: "Rocket Lab", href: "https://www.rocketlabusa.com" },
];

const FOOTER_EMAIL =
  "mailto:adarsh.loka@gmail.com?subject=LaunchScope%20Inquiry";

function scrollToHero() {
  const hero = document.getElementById("hero");
  if (hero) {
    hero.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function FooterHomeLink() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  function handleClick(e) {
    if (isHome) {
      e.preventDefault();
      scrollToHero();
    }
  }

  return (
    <Link to="/" className="ls-footer__link" onClick={handleClick}>
      Home
    </Link>
  );
}

function AppFooter() {
  return (
    <footer className="ls-footer">
      <div className="ls-footer__inner">
        <div className="ls-footer__top">
          <div className="ls-footer__brand">
            <p className="ls-footer__brand-name">LAUNCH SCOPE</p>
            <p className="ls-footer__brand-tagline">
              Track Humanity&apos;s Next Launch.
            </p>
            <p className="ls-footer__api">Powered by SpaceDevs API</p>
          </div>

          <div className="ls-footer__columns">
            <div>
              <p className="ls-footer__column-title">Explore</p>
              <ul className="ls-footer__link-list">
                <li>
                  <FooterHomeLink />
                </li>
                <li>
                  <Link to="/favourites" className="ls-footer__link">
                    Favourites
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="ls-footer__link">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="ls-footer__column-title">Space Resources</p>
              <ul className="ls-footer__link-list">
                {FOOTER_SPACE_RESOURCES.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="ls-footer__link ls-footer__link--external"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="ls-footer__column-title">Contact</p>
              <ul className="ls-footer__link-list">
                <li>
                  <a
                    href={FOOTER_EMAIL}
                    className="ls-footer__email-action"
                  >
                    <span className="ls-footer__email-icon" aria-hidden="true">
                      ✉
                    </span>
                    Email Me
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="ls-footer__bottom">
          <span>© {new Date().getFullYear()} LAUNCH SCOPE</span>
          <span className="ls-footer__credit">Built by A</span>
        </div>
      </div>
    </footer>
  );
}

function AppContent() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const { user, logout } = useAuth();

  const [launches, setLaunches] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchLaunches() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/launches");

      setLaunches(response.data);
    } catch (error) {
      console.log(error);

      setError("Failed to load launches 🚀");

      toast.error("Launch loading failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadFavourites() {
    try {
      if (!user) return;

      const response = await api.get("/favourites");

      setFavourites(response.data.favourites);
    } catch (error) {
      console.log(error);
    }
  }

  async function toggleFavourite(launchId) {
    try {
      if (!user) {
        toast.error("Please login first 🚀");
        return;
      }

      const response = await api.post(`/favourites/${launchId}`);

      setFavourites(response.data.favourites);

      toast.success("Favourites updated 🚀");
    } catch (error) {
      console.log(error);

      toast.error("Failed to update favourites");
    }
  }

  function handleLogout() {
    logout();

    toast.success("Logged out 🚀");

    window.location.href = "/login";
  }

  useEffect(() => {
    fetchLaunches();
  }, []);

  useEffect(() => {
    loadFavourites();
  }, [user]);

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const pageVariants = {
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -8 },
  };

  return (
    <div className="app-shell">
      {!isAuthPage && (
        <Navbar user={user} onLogout={handleLogout} />
      )}

      {error && (
        <div className="error-box" role="alert">
          {error}
        </div>
      )}

      {loading && !isAuthPage && (
        <main className="app-main app-main--loading loading-shell" aria-busy="true">
          <div className="loading-shell__header">
            <p className="loading-shell__label">Mission Control</p>
            <h2 className="loading-shell__title">Syncing launch manifest</h2>
            <div className="loading-shell__bar" aria-hidden="true" />
          </div>
          <div className="launch-grid ls-launch-grid">
            {[...Array(8)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </main>
      )}

      {!loading && (
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            className={
              isAuthPage
                ? "ls-auth-wrapper"
                : "app-main app-main--flush"
            }
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <Routes location={location}>
              <Route
                path="/"
                element={
                  <Home
                    launches={launches}
                    favourites={favourites}
                    toggleFavourite={toggleFavourite}
                  />
                }
              />

              <Route path="/login" element={<Login />} />

              <Route path="/signup" element={<Signup />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favourites"
                element={
                  <ProtectedRoute>
                    <Favourites
                      launches={launches}
                      favourites={favourites}
                      toggleFavourite={toggleFavourite}
                    />
                  </ProtectedRoute>
                }
              />

              <Route path="/launch/:id" element={<LaunchDetails />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      )}

      {!isAuthPage && !loading && <AppFooter />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
