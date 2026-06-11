import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import LaunchCard from "../components/LaunchCard";

export default function Favourites({
  launches,
  favourites,
  toggleFavourite,
}) {
  const prefersReducedMotion = useReducedMotion();

  const favouriteLaunches = launches.filter((launch) =>
    favourites.includes(launch.id)
  );

  return (
    <div className="home-page favourites-page">
      <motion.header
        className="ls-page-hero ls-page-hero--compact"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="ls-page-hero__eyebrow">Launch Intelligence · Watchlist</p>
        <h1 className="ls-page-hero__title">Saved missions</h1>
        <p className="ls-page-hero__sub">
          Monitor {favouriteLaunches.length} mission
          {favouriteLaunches.length === 1 ? "" : "s"} on your personal launch
          manifest.
        </p>
      </motion.header>

      {favouriteLaunches.length === 0 && (
        <motion.div
          className="ls-empty ls-empty--favourites"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          role="status"
        >
          <div className="ls-empty__icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7L12 16.8 5.7 21l2.3-7-6-4.6h7.6L12 2z" />
            </svg>
          </div>
          <p className="ls-empty__title">No missions on your manifest</p>
          <p className="ls-empty__text">
            Save launches from the home feed to track them here with live
            countdowns.
          </p>
          <Link to="/" className="ls-btn ls-btn--primary">
            Explore launches
          </Link>
        </motion.div>
      )}

      {favouriteLaunches.length > 0 && (
        <section className="ls-launches" aria-label="Saved launches">
          <div className="ls-launches__header">
            <h2 className="ls-launches__title">Your watchlist</h2>
            <span className="ls-launches__live">
              <span className="ls-launches__live-dot" aria-hidden="true" />
              {favouriteLaunches.length} active
            </span>
          </div>

          <div className="launch-grid ls-launch-grid">
            {favouriteLaunches.map((launch, index) => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                toggleFavourite={toggleFavourite}
                isFavourite={favourites.includes(launch.id)}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
