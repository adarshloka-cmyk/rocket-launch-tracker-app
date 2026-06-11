import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";
import { FALLBACK_CARD_IMAGE } from "../utils/imageOptimizer";
import { getNormalizedStatus, LAUNCH_STATES } from "../utils/launchStatus";

function getStatusClass(status) {
  const name = status?.toLowerCase() || "";
  if (name.includes("go")) return "ls-status--go";
  if (name.includes("success")) return "ls-status--success";
  if (name.includes("fail")) return "ls-status--failure";
  if (name.includes("tbd") || name.includes("hold")) return "ls-status--tbd";
  return "ls-status--default";
}

function formatLaunchDate(net) {
  const d = new Date(net);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LaunchCard({
  launch,
  toggleFavourite,
  isFavourite,
  index = 0,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    launched: false,
  });

  useEffect(() => {
    function updateCountdown() {
      const launchTime = new Date(launch.net).getTime();
      const now = new Date().getTime();
      const distance = launchTime - now;

      if (distance <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          launched: true,
        });
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        launched: false,
      });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [launch.net]);

  const statusName = launch.status?.name || "TBD";
  const normalizedState = getNormalizedStatus(statusName);
  const showCountdown = normalizedState === LAUNCH_STATES.UPCOMING && !countdown.launched;

  function getStatusTextClass(state) {
    if (state === LAUNCH_STATES.SUCCESS || state === LAUNCH_STATES.IN_FLIGHT) {
      return "ls-card__status-text--success";
    }
    if (state === LAUNCH_STATES.FAILURE) {
      return "ls-card__status-text--failure";
    }
    if (state === LAUNCH_STATES.HOLD) {
      return "ls-card__status-text--hold";
    }
    if (state === LAUNCH_STATES.TBD) {
      return "ls-card__status-text--tbd";
    }
    return "ls-card__status-text--upcoming";
  }

  const rocketName =
    launch.rocket?.configuration?.full_name ||
    launch.rocket?.configuration?.name ||
    "Launch vehicle TBD";
  const padName = launch.pad?.name || launch.pad?.location?.name || "Pad TBD";
  const providerName = launch.launch_service_provider?.name;

  return (
    <motion.article
      className="ls-card"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: prefersReducedMotion ? 0 : index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -8 }}
    >
      <div className="ls-card__media">
        <OptimizedImage
          src={launch.image}
          fallbackSrc={FALLBACK_CARD_IMAGE}
          alt={launch.name || ""}
          className="ls-card__img"
          width={500}
        />
        <div className="ls-card__media-overlay" aria-hidden="true" />

        <div className="ls-card__media-top">
          <span
            className={`ls-status ${getStatusClass(statusName)}`}
          >
            {statusName}
          </span>
          <time className="ls-card__date" dateTime={launch.net}>
            {formatLaunchDate(launch.net)}
          </time>
        </div>

        <div className="ls-card__countdown-wrap">
          <p className="ls-card__countdown-label-top">
            {showCountdown ? "T-minus" : "Status"}
          </p>
          <div className="ls-card__countdown" aria-live="polite">
            {showCountdown ? (
              <>
                <div className="ls-card__countdown-unit">
                  <span className="ls-card__countdown-val">
                    {String(countdown.days).padStart(2, "0")}
                  </span>
                  <span className="ls-card__countdown-label">Days</span>
                </div>
                <span className="ls-card__countdown-sep">:</span>
                <div className="ls-card__countdown-unit">
                  <span className="ls-card__countdown-val">
                    {String(countdown.hours).padStart(2, "0")}
                  </span>
                  <span className="ls-card__countdown-label">Hrs</span>
                </div>
                <span className="ls-card__countdown-sep">:</span>
                <div className="ls-card__countdown-unit">
                  <span className="ls-card__countdown-val">
                    {String(countdown.minutes).padStart(2, "0")}
                  </span>
                  <span className="ls-card__countdown-label">Min</span>
                </div>
                <span className="ls-card__countdown-sep">:</span>
                <div className="ls-card__countdown-unit">
                  <span className="ls-card__countdown-val">
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                  <span className="ls-card__countdown-label">Sec</span>
                </div>
              </>
            ) : (
              <span className={`ls-card__countdown-launched ${getStatusTextClass(normalizedState)}`}>
                {statusName}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="ls-card__body">
        <div className="ls-card__body-head">
          <h2 className="ls-card__title">
            <Link to={`/launch/${launch.id}`}>{launch.name}</Link>
          </h2>
          {providerName && (
            <p className="ls-card__provider">{providerName}</p>
          )}
        </div>

        <div className="ls-card__meta">
          <span className="ls-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
            </svg>
            {rocketName}
          </span>
          <span className="ls-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
              <circle cx="12" cy="10" r="2" />
            </svg>
            {padName}
          </span>
        </div>

        <div className="ls-card__actions">
          <Link
            to={`/launch/${launch.id}`}
            className="ls-btn ls-btn--primary ls-btn--sm"
          >
            Mission brief
          </Link>
          <button
            type="button"
            className={`ls-btn ls-btn--ghost ls-btn--sm ${isFavourite ? "is-active" : ""}`}
            onClick={() => toggleFavourite(launch.id)}
            aria-pressed={isFavourite}
          >
            {isFavourite ? "Saved" : "Save mission"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
