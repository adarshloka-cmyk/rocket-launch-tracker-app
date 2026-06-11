import { useEffect, useMemo, useState, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Link } from "react-router-dom";
import LaunchCard from "../components/LaunchCard";
import CustomSelect from "../components/CustomSelect";
import { matchesStatusFilter, getNormalizedStatus, LAUNCH_STATES } from "../utils/launchStatus";

const STATUS_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Go", label: "Go" },
  { value: "TBD", label: "TBD" },
  { value: "Success", label: "Success" },
  { value: "Failure", label: "Failure" },
];

import { getOptimizedImageUrl, FALLBACK_HERO_IMAGE } from "../utils/imageOptimizer";
const FALLBACK_HERO = FALLBACK_HERO_IMAGE;

function useSpotlightCountdown(net) {
  const [parts, setParts] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    launched: false,
  });

  useEffect(() => {
    if (!net) return;

    function tick() {
      const distance = new Date(net).getTime() - Date.now();
      if (distance <= 0) {
        setParts({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
          launched: true,
        });
        return;
      }
      setParts({
        days: String(
          Math.floor(distance / (1000 * 60 * 60 * 24))
        ).padStart(2, "0"),
        hours: String(
          Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
        ).padStart(2, "0"),
        minutes: String(
          Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        ).padStart(2, "0"),
        seconds: String(
          Math.floor((distance % (1000 * 60)) / 1000)
        ).padStart(2, "0"),
        launched: false,
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [net]);

  return parts;
}

export default function Home({
  launches,
  favourites,
  toggleFavourite,
}) {
  const prefersReducedMotion = useReducedMotion();
  const launchesRef = useRef(null);

  const nextLaunch = useMemo(() => {
    const now = Date.now();
    const upcoming = [...launches]
      .filter((l) => l.net && new Date(l.net).getTime() > now)
      .sort((a, b) => new Date(a.net) - new Date(b.net));
    return upcoming[0] || launches[0] || null;
  }, [launches]);

  const spotlightCountdown = useSpotlightCountdown(nextLaunch?.net);

  const nextLaunchStatusName = nextLaunch?.status?.name || "TBD";
  const nextLaunchState = getNormalizedStatus(nextLaunchStatusName);
  const isNextLaunchUpcoming = nextLaunch && nextLaunchState === LAUNCH_STATES.UPCOMING && !spotlightCountdown.launched;

  function getNextLaunchStatusTextClass(state) {
    if (state === LAUNCH_STATES.SUCCESS || state === LAUNCH_STATES.IN_FLIGHT) {
      return "ls-spotlight__status-val--success";
    }
    if (state === LAUNCH_STATES.FAILURE) {
      return "ls-spotlight__status-val--failure";
    }
    if (state === LAUNCH_STATES.HOLD) {
      return "ls-spotlight__status-val--hold";
    }
    if (state === LAUNCH_STATES.TBD) {
      return "ls-spotlight__status-val--tbd";
    }
    return "ls-spotlight__status-val--upcoming";
  }

  const heroImage =
    nextLaunch?.image || launches.find((l) => l.image)?.image || FALLBACK_HERO;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [providerFilter, setProviderFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(9);
  const [heroVideoReady, setHeroVideoReady] = useState(false);
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 22 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-12, 12]);
  const glowX = useTransform(springX, [-0.5, 0.5], ["42%", "58%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["38%", "52%"]);

  useEffect(() => {
    const video = document.getElementById("ls-global-hero-video");
    const container = document.getElementById("hero-video-container");

    if (!video || !container) return;

    // Set poster attribute
    if (heroImage) {
      video.setAttribute("poster", heroImage);
    }

    // Reparent video to the Home hero container
    container.appendChild(video);

    // Update ready state immediately if already loaded
    if (video.readyState >= 3) {
      setHeroVideoReady(true);
    }

    // Attempt to play
    video.play().catch((err) => {
      console.log("Auto-play prevented or failed:", err);
    });

    const handleReady = () => setHeroVideoReady(true);
    const handleError = () => setHeroVideoFailed(true);

    video.addEventListener("canplay", handleReady);
    video.addEventListener("loadeddata", handleReady);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("canplay", handleReady);
      video.removeEventListener("loadeddata", handleReady);
      video.removeEventListener("error", handleError);

      // Pause the video when leaving Home
      video.pause();

      // Put it back to the global portal
      const portal = document.getElementById("ls-global-video-portal");
      if (portal) {
        portal.appendChild(video);
      }
    };
  }, [heroImage]);

  useEffect(() => {
    const video = document.getElementById("ls-global-hero-video");
    if (video) {
      if (heroVideoReady) {
        video.classList.add("is-ready");
      } else {
        video.classList.remove("is-ready");
      }
    }
  }, [heroVideoReady]);

  const providers = useMemo(() => {
    const names = launches.map(
      (launch) => launch.launch_service_provider?.name
    );
    return ["All", ...new Set(names.filter(Boolean))];
  }, [launches]);

  const agencyOptions = useMemo(() => {
    const thumbByProvider = {};
    launches.forEach((launch) => {
      const name = launch.launch_service_provider?.name;
      if (name && !thumbByProvider[name] && launch.image) {
        thumbByProvider[name] = launch.image;
      }
    });

    return providers.map((provider) => ({
      value: provider,
      label: provider === "All" ? "All Agencies" : provider,
      thumbnail:
        provider === "All" ? null : getOptimizedImageUrl(thumbByProvider[provider], 100) || null,
      icon:
        provider === "All" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        ) : null,
    }));
  }, [providers, launches]);

  const filteredLaunches = useMemo(() => {
    const term = search.trim().toLowerCase();

    return launches.filter((launch) => {
      if (term && !launch.name?.toLowerCase().includes(term)) {
        return false;
      }
      if (!matchesStatusFilter(launch, statusFilter)) {
        return false;
      }
      if (
        providerFilter !== "All" &&
        launch.launch_service_provider?.name !== providerFilter
      ) {
        return false;
      }
      return true;
    });
  }, [launches, search, statusFilter, providerFilter]);



  useEffect(() => {
    setVisibleCount(9);
  }, [search, statusFilter, providerFilter]);

  function loadMore() {
    setVisibleCount((prev) => prev + 6);
  }

  function handleHeroMouse(e) {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function scrollToLaunches() {
    launchesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="home-page">
      <section
        id="hero"
        className="ls-hero"
        onMouseMove={handleHeroMouse}
        aria-labelledby="hero-heading"
      >
        {!heroVideoFailed && (
          <div
            id="hero-video-container"
            className="ls-hero__video-container"
            aria-hidden="true"
          />
        )}
        <div
          className={`ls-hero__bg ${
            heroVideoReady && !heroVideoFailed ? "is-fallback" : ""
          }`}
          style={{ backgroundImage: `url(${getOptimizedImageUrl(heroImage, 1200)})` }}
          aria-hidden="true"
        />
        <div className="ls-hero__bg-overlay" aria-hidden="true" />
        <div className="ls-hero__grid-lines" aria-hidden="true" />
        <motion.div
          className="ls-hero__glow"
          style={{
            left: prefersReducedMotion ? "50%" : glowX,
            top: prefersReducedMotion ? "40%" : glowY,
          }}
          aria-hidden="true"
        />

        <div className="ls-hero__inner">
          <motion.div
            className="ls-hero__copy"
            style={
              prefersReducedMotion
                ? undefined
                : { x: parallaxX, y: parallaxY }
            }
            initial={prefersReducedMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="ls-hero__brand-mobile" aria-hidden="true">
              LAUNCHSCOPE
            </p>

            <p className="ls-hero__eyebrow">
              <span className="ls-hero__eyebrow-icon" aria-hidden="true" />
              Launch Intelligence
            </p>

            <h1 id="hero-heading" className="ls-hero__title">
              Track Humanity&apos;s{" "}
              <span className="ls-hero__title-accent">Next Launch.</span>
            </h1>

            <p className="ls-hero__subtitle">
              Real-time data. Live countdowns. Global coverage.
            </p>

            <div className="ls-hero__cta">
              <button
                type="button"
                className="ls-btn ls-btn--primary ls-btn--lg"
                onClick={scrollToLaunches}
              >
                Explore Launches
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>

          {nextLaunch && (
            <motion.aside
              className="ls-spotlight"
              initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p className="ls-spotlight__label">
                {isNextLaunchUpcoming ? "Next Launch" : "Launch Status"}
              </p>
              <h2 className="ls-spotlight__name">{nextLaunch.name}</h2>

              <div className="ls-spotlight__countdown" aria-live="polite">
                {isNextLaunchUpcoming ? (
                  <>
                    {[
                      ["Days", spotlightCountdown.days],
                      ["Hrs", spotlightCountdown.hours],
                      ["Min", spotlightCountdown.minutes],
                      ["Sec", spotlightCountdown.seconds],
                    ].map(([label, val], i) => (
                      <div key={label} className="ls-spotlight__countdown-cell">
                        {i > 0 && (
                          <span className="ls-spotlight__sep" aria-hidden="true">
                            :
                          </span>
                        )}
                        <span className="ls-spotlight__val">{val}</span>
                        <span className="ls-spotlight__unit">{label}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <span className={`ls-spotlight__status-val ${getNextLaunchStatusTextClass(nextLaunchState)}`}>
                    {nextLaunchStatusName}
                  </span>
                )}
              </div>

              <div className="ls-spotlight__meta">
                <span>
                  {nextLaunch.rocket?.configuration?.full_name ||
                    "Vehicle TBD"}
                </span>
                <span>
                  {nextLaunch.pad?.name ||
                    nextLaunch.pad?.location?.name ||
                    "Site TBD"}
                </span>
              </div>

              <Link
                to={`/launch/${nextLaunch.id}`}
                className="ls-spotlight__link"
              >
                View mission
              </Link>
            </motion.aside>
          )}
        </div>

        <motion.button
          type="button"
          className="ls-hero__scroll"
          onClick={scrollToLaunches}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          aria-label="Scroll to explore launches"
        >
          <span className="ls-hero__scroll-mouse" aria-hidden="true" />
          <span>Scroll to explore</span>
        </motion.button>
      </section>

      <div className="home-page__content">
        <motion.div
          className="ls-filters"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <label className="ls-filters__search">
            <span className="visually-hidden">Search launches</span>
            <svg
              className="ls-filters__icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3-3" />
            </svg>
            <input
              type="search"
              placeholder="Search launches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <CustomSelect
            label="Filter by agency"
            value={providerFilter}
            onChange={setProviderFilter}
            options={agencyOptions}
            searchable
            searchPlaceholder="Search agencies…"
            className="ls-filters__select ls-filters__select--agency"
          />

          <CustomSelect
            label="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            className="ls-filters__select"
          />

          <button
            type="button"
            className="ls-filters__action"
            onClick={scrollToLaunches}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 12h10M4 18h6" />
            </svg>
            Filters
          </button>
        </motion.div>

        <section
          id="launches"
          ref={launchesRef}
          className="ls-launches"
          aria-labelledby="launches-heading"
        >
          <div className="ls-launches__header">
            <div>
              <h2 id="launches-heading" className="ls-launches__title">
                Upcoming Launches
              </h2>
              <p className="ls-launches__sub">
                Showing{" "}
                {Math.min(visibleCount, filteredLaunches.length)} of{" "}
                {filteredLaunches.length} missions
              </p>
            </div>
            <span className="ls-launches__live">
              <span className="ls-launches__live-dot" aria-hidden="true" />
              Live
            </span>
          </div>

          {filteredLaunches.length === 0 && (
            <div className="ls-empty" role="status">
              <p className="ls-empty__title">No missions match your filters</p>
              <p className="ls-empty__text">
                Adjust search or status to discover more launches.
              </p>
            </div>
          )}

          <div className="launch-grid ls-launch-grid">
            {filteredLaunches.slice(0, visibleCount).map((launch, index) => (
              <LaunchCard
                key={launch.id}
                launch={launch}
                toggleFavourite={toggleFavourite}
                isFavourite={favourites.includes(launch.id)}
                index={index}
              />
            ))}
          </div>

          {visibleCount < filteredLaunches.length && (
            <div className="load-more-wrapper">
              <button
                type="button"
                className="ls-btn ls-btn--primary load-more-btn"
                onClick={loadMore}
              >
                Load more missions
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
