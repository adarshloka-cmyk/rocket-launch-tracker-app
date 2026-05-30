import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api
from "../api/api";

import {
  useAuth,
} from "../context/AuthContext";

export default function Profile() {

  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const [user,
    setUser] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  async function fetchProfile() {

    try {

      const response =
        await api.get(
          "/profile"
        );

      setUser(
        response.data
      );

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

      <div className="loading">

        Loading Profile...

      </div>
    );

  }

  if (!user) {

    return (

      <div className="profile-page">

        <h1>

          Please Login

        </h1>

      </div>
    );

  }

  return (

    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">

          🚀

        </div>

        <h1>

          {user.name}

        </h1>

        <p>

          {user.email}

        </p>

        <div
          className="profile-grid"
        >

          <div
            className="profile-stat"
          >

            <h3>

              Favourites

            </h3>

            <span>

{
  user.activeFavouritesCount || 0
}

            </span>

          </div>

          <div
            className="profile-stat"
          >

            <h3>

              Account

            </h3>

            <span>

              Active

            </span>

          </div>

          <div
            className="profile-stat"
          >

            <h3>

              Email

            </h3>

            <span>

              Verified

            </span>

          </div>

          <div
            className="profile-stat"
          >

            <h3>

              Member Type

            </h3>

            <span>

              User

            </span>

          </div>

        </div>

        <button
          onClick={
            handleLogout
          }
        >

          Logout

        </button>

      </div>

    </div>
  );

}