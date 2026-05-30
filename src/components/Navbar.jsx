import {
  Link,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

export default function Navbar(props) {

  const {
    user,
    logout,
  } = useAuth();

  return (

    <nav className="navbar">

      <h2>
        🚀 RocketLaunch
      </h2>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/favourites">
          Favourites
        </Link>

        {

          user ? (

            <>

              <Link to="/profile">
                Profile
              </Link>

              <button
                onClick={logout}
                className="nav-btn"
              >
                Logout
              </button>

            </>

          ) : (

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

      <button
        className="theme-btn"
        onClick={props.toggleTheme}
      >

        {
          props.darkMode
            ? "☀️ Light"
            : "🌙 Dark"
        }

      </button>

    </nav>
  );
}