import api from "../api/api";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../context/AuthContext";

export default function Login() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate =
    useNavigate();

  /* =========================
     AUTH
  ========================= */

  const {
    login,
  } = useAuth();

  /* =========================
     STATES
  ========================= */

  const [email,
    setEmail] =
    useState("");

  const [password,
    setPassword] =
    useState("");

  const [error,
    setError] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  /* =========================
     LOGIN
  ========================= */

  async function handleLogin(
    e
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      const response =
        await api.post(

          "/auth/login",

          {
            email,
            password,
          }
        );

      /* UPDATE AUTH CONTEXT */

      login(

        response.data.user,

        response.data.token
      );

      alert(
        "Login successful"
      );

      navigate("/");

    } catch (error) {

      console.log(error);

      setError(

        error.response?.data
          ?.message ||

        "Server Error"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="auth-page">

      <form

        className="auth-form"

        onSubmit={handleLogin}

      >

        <h1>
          Login
        </h1>

        <p>
          Login to continue
          tracking launches.
        </p>

        {

          error && (

            <p
              style={{

                color: "red",

                marginBottom: "10px",
              }}
            >

              {error}

            </p>
          )
        }

        <input

          type="email"

          placeholder="Enter Email"

          value={email}

          onChange={(e) =>

            setEmail(
              e.target.value
            )
          }

          required

        />

        <input

          type="password"

          placeholder="Enter Password"

          value={password}

          onChange={(e) =>

            setPassword(
              e.target.value
            )
          }

          required

        />

        <button
          type="submit"
          disabled={loading}
        >

          {

            loading

              ? "Logging in..."

              : "Login"

          }

        </button>

      </form>

    </div>
  );
}