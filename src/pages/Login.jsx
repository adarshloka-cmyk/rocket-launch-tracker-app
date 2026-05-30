import api from "../api/api";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

export default function Login() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate =
    useNavigate();

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

      console.log(
        "LOGIN STARTED"
      );

      /* REQUEST */

      const response =
        await api.post(

          "/auth/login",

          {
            email,
            password,
          }
        );

      console.log(
        "LOGIN SUCCESS:",
        response.data
      );

      /* SAVE TOKEN */

      localStorage.setItem(

        "token",

        response.data.token
      );

      /* SAVE USER */

      localStorage.setItem(

        "user",

        JSON.stringify(
          response.data.user
        )
      );

      alert(
        "Login successful 🚀"
      );

      navigate("/");

    } catch (error) {

      console.log(

        "FULL LOGIN ERROR:",

        error,

        error.response,

        error.response?.data,

        error.response?.status,

        error.message
      );

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
          Login 🚀
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

              : "Login 🚀"

          }

        </button>

      </form>

    </div>
  );
}