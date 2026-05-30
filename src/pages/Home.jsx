import {
  useEffect,
  useMemo,
  useState,
} from "react";

import LaunchCard
from "../components/LaunchCard";

export default function Home({

  launches,

  favourites,

  toggleFavourite,

}) {

  /* =========================
     STATES
  ========================= */

  const [search,
    setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("All");

  const [providerFilter,
    setProviderFilter] =
    useState("All");

  const [visibleCount,
    setVisibleCount] =
    useState(9);

  const [filteredLaunches,
    setFilteredLaunches] =
    useState([]);

  /* =========================
     UNIQUE PROVIDERS
  ========================= */

  const providers =
    useMemo(() => {

      const names =
        launches.map(

          (launch) =>

            launch
              .launch_service_provider
              ?.name
        );

      return [

        "All",

        ...new Set(names),
      ];

    }, [launches]);

  /* =========================
     FILTER LOGIC
  ========================= */

  useEffect(() => {

    let updated =
      [...launches];

    /* SEARCH */

    updated =
      updated.filter(

        (launch) =>

          launch.name
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )
      );

    /* STATUS */

    if (
      statusFilter !== "All"
    ) {

      updated =
        updated.filter(

          (launch) =>

            launch.status
              ?.name ===
            statusFilter
        );
    }

    /* PROVIDER */

    if (
      providerFilter !== "All"
    ) {

      updated =
        updated.filter(

          (launch) =>

            launch
              .launch_service_provider
              ?.name ===
            providerFilter
        );
    }

    setFilteredLaunches(
      updated
    );

  }, [

    launches,
    search,
    statusFilter,
    providerFilter,
  ]);

  /* =========================
     LOAD MORE
  ========================= */

  function loadMore() {

    setVisibleCount(

      (prev) => prev + 6
    );
  }

  return (

    <div className="home-page">

      {/* HERO */}

      <section className="hero">

        <h1>
          Rocket Launch Tracker 🚀
        </h1>

        <p>
          Track upcoming space
          launches worldwide
          in real-time.
        </p>

      </section>

      {/* FILTER BAR */}

      <div className="filter-bar">

        {/* SEARCH */}

        <input

          type="text"

          placeholder="Search launches..."

          value={search}

          onChange={(e) =>

            setSearch(
              e.target.value
            )
          }

        />

        {/* STATUS */}

        <select

          value={statusFilter}

          onChange={(e) =>

            setStatusFilter(
              e.target.value
            )
          }

        >

          <option>
            All
          </option>

          <option>
            Go
          </option>

          <option>
            TBD
          </option>

          <option>
            Success
          </option>

          <option>
            Failure
          </option>

        </select>

        {/* PROVIDERS */}

        <select

          value={providerFilter}

          onChange={(e) =>

            setProviderFilter(
              e.target.value
            )
          }

        >

          {

            providers.map(
              (provider) => (

                <option
                  key={provider}
                >

                  {provider}

                </option>
              )
            )
          }

        </select>

      </div>

      {/* RESULTS COUNT */}

      <div className="results-count">

        Showing

        {

          Math.min(
            visibleCount,
            filteredLaunches.length
          )
        }

        {" "}of{" "}

        {
          filteredLaunches.length
        }

        launches 🚀

      </div>

      {/* EMPTY */}

      {

        filteredLaunches.length === 0

        && (

          <div className="loading">

            No launches found 🚀

          </div>
        )
      }

      {/* GRID */}

      <div className="launch-grid">

        {

          filteredLaunches

            .slice(0, visibleCount)

            .map(
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

      {/* LOAD MORE */}

      {

        visibleCount <

        filteredLaunches.length

        && (

          <div className="load-more-wrapper">

            <button

              className="load-more-btn"

              onClick={loadMore}
            >

              Load More 🚀

            </button>

          </div>
        )
      }

    </div>
  );
}