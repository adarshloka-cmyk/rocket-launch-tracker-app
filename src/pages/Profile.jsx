import {
  useEffect,
  useState,
} from "react";

export default function Profile() {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  async function fetchProfile() {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {

        setLoading(false);
        return;

      }

      const response =
        await fetch(

          "http://localhost:5000/api/profile",

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setUser(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  function logout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";

  }

  useEffect(() => {

    fetchProfile();

  }, []);

  if (loading) {

    return (

      <div className="loading">

        Loading Profile 🚀

      </div>
    );

  }

  if (!user) {

    return (

      <div className="profile-page">

        <h1>

          Please Login 🚀

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

              ❤️ Favourites

            </h3>

            <span>

              {
                user.favourites
                  ?.length || 0
              }

            </span>

          </div>

          <div
            className="profile-stat"
          >

            <h3>

              🔐 Account

            </h3>

            <span>

              User

            </span>

          </div>

          <div
            className="profile-stat"
          >

            <h3>

              📧 Email

            </h3>

            <span>

              Verified

            </span>

          </div>

          <div
            className="profile-stat"
          >

            <h3>

              🚀 Launch Tracker

            </h3>

            <span>

              Active

            </span>

          </div>

        </div>

        <button
          onClick={logout}
        >

          Logout

        </button>

      </div>

    </div>
  );

}