import {
  Link,
} from "react-router-dom";

export default function Navbar(props) {

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
        <Link to="/login">
  Login
</Link>

<Link to="/signup">
  Signup
</Link>

<Link to="/profile">
  Profile
</Link>

      </div>

      <button
        className="theme-btn"
        onClick={props.toggleTheme}
      >

        {props.darkMode
          ? "☀️ Light"
          : "🌙 Dark"}

      </button>

    </nav>
  );
}
