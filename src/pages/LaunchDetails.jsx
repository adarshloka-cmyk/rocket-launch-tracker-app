import {

  useEffect,

  useState,

} from "react";

import {

  useParams,

} from "react-router-dom";

export default function LaunchDetails() {

  const { id } =
    useParams();

  const [launch,
    setLaunch] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  /* =========================
     FETCH SINGLE LAUNCH
  ========================= */

  async function fetchLaunch() {

    try {

      const response =
        await fetch(

          `https://ll.thespacedevs.com/2.2.0/launch/${id}`
        );

      const data =
        await response.json();

      setLaunch(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    fetchLaunch();

  }, []);

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div className="loading">

        Loading Mission 🚀

      </div>
    );
  }

  /* =========================
     NO DATA
  ========================= */

  if (!launch) {

    return (

      <div className="loading">

        Launch not found

      </div>
    );
  }

  const launchDate =
    new Date(
      launch.net
    );

  return (

    <div className="details-page">

      {/* IMAGE */}

      <img

        className="details-image"

        src={

          launch.image ||

          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"

        }

        alt={launch.name}

      />

      {/* TITLE */}

      <h1>
        {launch.name}
      </h1>

      {/* STATUS */}

      <div className="status-badge">

        {
          launch.status?.name
        }

      </div>

      {/* INFO GRID */}

      <div className="details-grid">

        <div className="details-card">

          <h3>
            🚀 Rocket
          </h3>

          <p>

            {
              launch.rocket
                ?.configuration
                ?.full_name
            }

          </p>

        </div>

        <div className="details-card">

          <h3>
            🏢 Provider
          </h3>

          <p>

            {
              launch.launch_service_provider
                ?.name
            }

          </p>

        </div>

        <div className="details-card">

          <h3>
            📍 Launch Pad
          </h3>

          <p>

            {
              launch.pad?.name
            }

          </p>

        </div>

        <div className="details-card">

          <h3>
            🌎 Location
          </h3>

          <p>

            {
              launch.pad
                ?.location
                ?.name
            }

          </p>

        </div>

        <div className="details-card">

          <h3>
            🕒 Launch Time
          </h3>

          <p>

            {
              launchDate.toLocaleString()
            }

          </p>

        </div>

        <div className="details-card">

          <h3>
            🛰 Orbit
          </h3>

          <p>

            {
              launch.mission
                ?.orbit?.name
            }

          </p>

        </div>

      </div>

      {/* MISSION DESCRIPTION */}

      <div className="mission-box">

        <h2>
          Mission Overview
        </h2>

        <p>

          {

            launch.mission
              ?.description ||

            "No mission description available."

          }

        </p>

      </div>

    </div>
  );
}