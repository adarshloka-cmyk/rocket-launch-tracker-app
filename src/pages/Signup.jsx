// FULL UPDATED SIGNUP.JSX

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast
from "react-hot-toast";

import api
from "../api/api";

export default function Signup() {

  /* =========================
     NAVIGATION
  ========================= */

  const navigate =
    useNavigate();

  /* =========================
     STATES
  ========================= */

  const [formData,
    setFormData] =
    useState({

      name: "",
      email: "",
      password: "",
    });

  const [loading,
    setLoading] =
    useState(false);

  /* =========================
     HANDLE CHANGE
  ========================= */

  function handleChange(e) {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  }

  /* =========================
     HANDLE SUBMIT
  ========================= */

  async function handleSubmit(
    e
  ) {

    e.preventDefault();

    try {

      setLoading(true);

      const response =
        await api.post(

          "/auth/signup",

          formData
        );

      const data =
        response.data;

      toast.success(

        data.message
      );

      navigate("/login");

    } catch (error) {

      console.log(error);

      toast.error(

        error.response?.data
          ?.message ||

        "Signup failed 🚀"
      );

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="auth-page">

      <form

        className="auth-form"

        onSubmit={handleSubmit}

      >

        <h1>
          Create Account 🚀
        </h1>

        <p>
          Join the rocket launch
          tracking platform.
        </p>

        {/* NAME */}

        <input

          type="text"

          name="name"

          placeholder="Enter Name"

          value={formData.name}

          onChange={handleChange}

          required

        />

        {/* EMAIL */}

        <input

          type="email"

          name="email"

          placeholder="Enter Email"

          value={formData.email}

          onChange={handleChange}

          required

        />

        {/* PASSWORD */}

        <input

          type="password"

          name="password"

          placeholder="Enter Password"

          value={formData.password}

          onChange={handleChange}

          required

        />

        {/* BUTTON */}

        <button
          type="submit"
        >

          {

            loading

              ? "Creating Account..."

              : "Signup 🚀"

          }

        </button>

      </form>

    </div>
  );
}