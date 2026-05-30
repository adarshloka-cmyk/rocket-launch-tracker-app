// FULL CLEAN WORKING APP.JSX

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import toast
from "react-hot-toast";

import api
from "./api/api";

/* =========================
   PAGES
========================= */

import Home
from "./pages/Home";

import Login
from "./pages/Login";

import Signup
from "./pages/Signup";

import Profile
from "./pages/Profile";

import Favourites
from "./pages/Favourites";

import LaunchDetails
from "./pages/LaunchDetails";

/* =========================
   COMPONENTS
========================= */

import ProtectedRoute
from "./components/ProtectedRoute";

import SkeletonCard
from "./components/SkeletonCard";

/* =========================
   AUTH CONTEXT
========================= */

import {
  useAuth,
} from "./context/AuthContext";

/* =========================
   CSS
========================= */

import "./App.css";

/* =========================
   MAIN APP CONTENT
========================= */

function AppContent() {

  /* =========================
     ROUTER LOCATION
  ========================= */

  const location =
    useLocation();

  /* =========================
     AUTH
  ========================= */

  const {
    user,
    logout,
  } = useAuth();

  /* =========================
     STATES
  ========================= */

  const [theme,
    setTheme] =
    useState(

      localStorage.getItem(
        "theme"
      ) || "dark"
    );

  const [launches,
    setLaunches] =
    useState([]);

  const [favourites,
    setFavourites] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  /* =========================
     SAVE THEME
  ========================= */

  useEffect(() => {

    localStorage.setItem(
      "theme",
      theme
    );

  }, [theme]);

  /* =========================
     FETCH LAUNCHES
  ========================= */

  async function fetchLaunches() {

    try {

      setLoading(true);

      setError("");

      const response =
        await api.get(
          "/launches"
        );

      setLaunches(
        response.data
      );

    } catch (error) {

      console.log(error);

      setError(
        "Failed to load launches 🚀"
      );

      toast.error(
        "Launch loading failed"
      );

    } finally {

      setLoading(false);

    }

  }

  /* =========================
     LOAD FAVOURITES
  ========================= */

  async function loadFavourites() {

    try {

      if (!user) return;

      const response =
        await api.get(
          "/favourites"
        );

      setFavourites(

        response.data
          .favourites
      );

    } catch (error) {

      console.log(error);

    }

  }

  /* =========================
     TOGGLE FAVOURITE
  ========================= */

  async function toggleFavourite(
    launchId
  ) {

    try {

      if (!user) {

        toast.error(
          "Please login first 🚀"
        );

        return;
      }

      const response =
        await api.post(

          `/favourites/${launchId}`
        );

      setFavourites(

        response.data
          .favourites
      );

      toast.success(
        "Favourites updated 🚀"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to update favourites"
      );

    }

  }

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout() {

    logout();

    toast.success(
      "Logged out 🚀"
    );

    window.location.href =
      "/login";
  }

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchLaunches();

  }, []);

  useEffect(() => {

    loadFavourites();

  }, [user]);

  /* =========================
     AUTH PAGE CHECK
  ========================= */

  const isAuthPage =

    location.pathname ===
      "/login"

    ||

    location.pathname ===
      "/signup";

  return (

    <div className={theme}>

      {/* =========================
         NAVBAR
      ========================= */}

      {

        !isAuthPage && (

          <nav className="navbar">

            {/* LOGO */}

            <div className="logo">

              🚀 Rocket Launch

            </div>

            {/* LINKS */}

            <div className="nav-links">

              <Link to="/">
                Home
              </Link>

              <Link to="/favourites">
                Favourites
              </Link>

              <Link to="/profile">
                Profile
              </Link>

              {

                !user && (

                  <>

                    <Link to="/login">
                      Login
                    </Link>

                    <Link to="/signup">
                      Signup
                    </Link>

                  </>
                )
              }

            </div>

            {/* RIGHT */}

            <div className="nav-right">

              {

                user && (

                  <div className="nav-user">

                    🚀 {user.name}

                  </div>
                )
              }

              {/* THEME */}

              <button

                className="theme-btn"

                onClick={() =>

                  setTheme(

                    theme === "dark"

                      ? "light"

                      : "dark"
                  )
                }
              >

                {

                  theme === "dark"

                    ? "☀"

                    : "🌙"

                }

              </button>

              {/* LOGOUT */}

              {

                user && (

                  <button

                    className="logout-btn"

                    onClick={
                      handleLogout
                    }
                  >

                    Logout

                  </button>
                )
              }

            </div>

          </nav>
        )
      }

      {/* =========================
         ERROR
      ========================= */}

      {

        error && (

          <div className="error-box">

            {error}

          </div>
        )
      }

      {/* =========================
         LOADING
      ========================= */}

      {

        loading && (

          <div className="launch-grid">

            {

              [...Array(8)].map(
                (_, index) => (

                  <SkeletonCard
                    key={index}
                  />
                )
              )
            }

          </div>
        )
      }

      {/* =========================
         ROUTES
      ========================= */}

      {

        !loading && (

          <Routes>

            {/* HOME */}

            <Route

              path="/"

              element={

                <Home

                  launches={
                    launches
                  }

                  favourites={
                    favourites
                  }

                  toggleFavourite={
                    toggleFavourite
                  }

                />

              }

            />

            {/* LOGIN */}

            <Route

              path="/login"

              element={<Login />}

            />

            {/* SIGNUP */}

            <Route

              path="/signup"

              element={<Signup />}

            />

            {/* PROFILE */}

            <Route

              path="/profile"

              element={

                <ProtectedRoute>

                  <Profile />

                </ProtectedRoute>

              }

            />

            {/* FAVOURITES */}

            <Route

              path="/favourites"

              element={

                <ProtectedRoute>

                  <Favourites

                    launches={
                      launches
                    }

                    favourites={
                      favourites
                    }

                    toggleFavourite={
                      toggleFavourite
                    }

                  />

                </ProtectedRoute>

              }

            />

            {/* DETAILS */}

            <Route

              path="/launch/:id"

              element={

                <LaunchDetails />

              }

            />

          </Routes>
        )
      }

      {/* =========================
         FOOTER
      ========================= */}

      {

        !isAuthPage && (

          <footer className="footer">

            <h3>
              🚀 Rocket Launch Tracker
            </h3>

            <p>
              Real-time space launch
              tracking platform.
            </p>

            <p>
              Powered by SpaceDevs API
            </p>

            <div className="footer-links">

              <a href="#">
                About
              </a>

              <a href="#">
                Contact
              </a>

              <a href="#">
                Github
              </a>

            </div>

            <div className="watermark">

              Built by A 🚀

            </div>

          </footer>
        )
      }

    </div>
  );
}

/* =========================
   MAIN APP
========================= */

export default function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}