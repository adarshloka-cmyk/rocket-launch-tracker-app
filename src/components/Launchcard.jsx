import {

  Link,

} from "react-router-dom";

import {

  useEffect,

  useState,

} from "react";

export default function LaunchCard({

  launch,

  toggleFavourite,

  isFavourite,

}) {

  /* =========================
     COUNTDOWN
  ========================= */

  const [countdown,
    setCountdown] =
    useState("");

  useEffect(() => {

    function updateCountdown() {

      const launchTime =
        new Date(
          launch.net
        ).getTime();

      const now =
        new Date().getTime();

      const distance =
        launchTime - now;

      if (distance <= 0) {

        setCountdown(
          "🚀 Launched"
        );

        return;
      }

      const days =
        Math.floor(

          distance /

          (1000 * 60 * 60 * 24)
        );

      const hours =
        Math.floor(

          (

            distance %

            (1000 * 60 * 60 * 24)

          ) /

          (1000 * 60 * 60)
        );

      const minutes =
        Math.floor(

          (

            distance %

            (1000 * 60 * 60)

          ) /

          (1000 * 60)
        );

      const seconds =
        Math.floor(

          (

            distance %

            (1000 * 60)

          ) / 1000
        );

      setCountdown(

        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    }

    updateCountdown();

    const interval =
      setInterval(

        updateCountdown,

        1000
      );

    return () =>
      clearInterval(interval);

  }, [launch.net]);

  /* =========================
     DATE FORMAT
  ========================= */

  const launchDate =
    new Date(
      launch.net
    );

  const localTime =
    launchDate.toLocaleString();

  const indiaTime =
    launchDate.toLocaleString(
      "en-IN",
      {
        timeZone:
          "Asia/Kolkata",
      }
    );

  return (

    <div className="launch-card">

      {/* IMAGE */}

      <img

        src={

          launch.image ||

          "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa"

        }

        alt={launch.name}

      />

      <div className="card-content">

        {/* TITLE */}

        <h2>
          {launch.name}
        </h2>

        {/* STATUS */}

        <div className="status-badge">

          {
            launch.status
              ?.name
          }

        </div>

        {/* COUNTDOWN */}

        <div className="countdown-box">

          ⏳ {countdown}

        </div>

        {/* PROVIDER */}

        <p className="provider">

          <strong>
            Provider:
          </strong>

          {

            launch
              .launch_service_provider
              ?.name
          }

        </p>

        {/* LOCAL TIME */}

        <div className="time-section">

          <p>
            🌍 Local Time
          </p>

          <span>
            {localTime}
          </span>

        </div>

        {/* IST */}

        <div className="time-section">

          <p>
            🇮🇳 IST
          </p>

          <span>
            {indiaTime}
          </span>

        </div>

        {/* LOCATION */}

        <p className="location">

          📍

          {
            launch.pad
              ?.location?.name
          }

        </p>

        {/* BUTTONS */}

        <div className="button-group">

          {/* DETAILS */}

          <Link
            to={`/launch/${launch.id}`}
          >

            <button>

              View Details

            </button>

          </Link>

          {/* FAVOURITE */}

          <button

            onClick={() =>

              toggleFavourite(
                launch.id
              )
            }

          >

            {

              isFavourite

                ? "💔 Unfavourite"

                : "❤️ Favourite"

            }

          </button>

        </div>

      </div>

    </div>
  );
}