import LaunchCard
from "../components/LaunchCard";

export default function Favourites({

  launches,

  favourites,

  toggleFavourite,

}) {

  /* FILTER ONLY FAVOURITES */

  const favouriteLaunches =
    launches.filter((launch) =>

      favourites.includes(
        launch.id
      )
    );

  return (

    <div className="home-page">

      <section className="hero">

        <h1>
          Favourite Launches 🚀
        </h1>

        <p>
          Your saved space
          missions.
        </p>

      </section>

      {/* EMPTY */}

      {

        favouriteLaunches.length === 0

        && (

          <div className="loading">

            No favourites yet 🚀

          </div>
        )
      }

      {/* GRID */}

      <div className="launch-grid">

        {

          favouriteLaunches.map(
            (launch) => (

              <LaunchCard

                key={launch.id}

                launch={launch}

                toggleFavourite={
                  toggleFavourite
                }

                isFavourite={

                  favourites.includes(
                    launch.id
                  )
                }

              />
            )
          )
        }

      </div>

    </div>
  );
}