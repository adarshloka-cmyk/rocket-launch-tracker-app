import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  downloadIcsFile,
  trackCalendarEvent,
} from "../utils/calendarHelpers";

import { getOptimizedImageUrl, FALLBACK_HERO_IMAGE } from "../utils/imageOptimizer";
const FALLBACK_IMAGE = FALLBACK_HERO_IMAGE;

function getStatusClass(status) {
  const name = status?.toLowerCase() || "";
  if (name.includes("go")) return "ls-status--go";
  if (name.includes("success")) return "ls-status--success";
  if (name.includes("fail")) return "ls-status--failure";
  if (name.includes("tbd") || name.includes("hold")) return "ls-status--tbd";
  return "ls-status--default";
}

function Reveal({ children, className = "", delay = 0 }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function LaunchDetails() {
  const { id } = useParams();
  const [launch, setLaunch] = useState(null);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  async function fetchLaunch() {
    try {
      const response = await fetch(
        `https://ll.thespacedevs.com/2.2.0/launch/${id}`
      );

      const data = await response.json();

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

  if (loading) {
    return (
      <div className="ls-mission-loading">
        <div className="loading-shell__bar" aria-hidden="true" />
        <p>Loading mission brief</p>
      </div>
    );
  }

  if (!launch) {
    return (
      <div className="ls-empty ls-empty--page">
        <p className="ls-empty__title">Launch not found</p>
        <Link to="/" className="ls-btn ls-btn--primary">
          Return to LAUNCHSCOPE
        </Link>
      </div>
    );
  }

  const launchDate = new Date(launch.net);
  const statusName = launch.status?.name || "TBD";
  const description =
    launch.mission?.description || "No mission description available.";

  const specs = [
    {
      label: "Launch vehicle",
      value: launch.rocket?.configuration?.full_name,
    },
    {
      label: "Launch provider",
      value: launch.launch_service_provider?.name,
    },
    {
      label: "Launch pad",
      value: launch.pad?.name,
    },
    {
      label: "Location",
      value: launch.pad?.location?.name,
    },
    {
      label: "Target orbit",
      value: launch.mission?.orbit?.name,
    },
    {
      label: "NET (local)",
      value: launchDate.toLocaleString(),
    },
  ].filter((s) => s.value);

  const timeline = [
    launch.window_start && {
      phase: "Launch window opens",
      detail: "Window start",
      time: new Date(launch.window_start).toLocaleString(),
    },
    launch.window_end && {
      phase: "Launch window closes",
      detail: "Window end",
      time: new Date(launch.window_end).toLocaleString(),
    },
    {
      phase: "NET — No Earlier Than",
      detail: launch.name,
      time: launchDate.toLocaleString(),
    },
    {
      phase: "Current status",
      detail: statusName,
      time: null,
    },
  ].filter(Boolean);

  return (
    <article className="ls-mission">
      <header className="ls-mission-hero">
        <div
          className="ls-mission-hero__bg"
          style={{
            backgroundImage: `url(${getOptimizedImageUrl(launch.image, 1200)})`,
          }}
          aria-hidden="true"
        />
        <div className="ls-mission-hero__overlay" aria-hidden="true" />

        <motion.div
          className="ls-mission-hero__content"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="ls-mission-hero__back">
            ← All missions
          </Link>

          <p className="ls-mission-hero__eyebrow">Mission brief</p>

          <h1 className="ls-mission-hero__title">{launch.name}</h1>

          <div className="ls-mission-hero__badges">
            <span className={`ls-status ${getStatusClass(statusName)}`}>
              {statusName}
            </span>
            <time dateTime={launch.net} className="ls-mission-hero__time">
              {launchDate.toLocaleString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        </motion.div>
      </header>

      <div className="ls-mission__body">
        <Reveal className="ls-mission-brief">
          <h2 className="ls-section-title">Mission overview</h2>
          <p className="ls-mission-brief__text">{description}</p>
        </Reveal>

        <Reveal className="ls-mission-planning" delay={0.04}>
          <h2 className="ls-section-title">Mission Planning</h2>
          <div className="ls-mission-planning__card">
            <p className="ls-mission-planning__text">
              Never miss an important launch. Add this mission to your preferred calendar and receive reminders on your own schedule.
            </p>
            
            <div className="ls-mission-planning__reminders">
              <span className="ls-mission-planning__reminders-label">Recommended Reminders</span>
              <div className="ls-mission-planning__chips">
                <span className="ls-mission-planning__chip">1 Day Before</span>
                <span className="ls-mission-planning__chip">1 Hour Before</span>
                <span className="ls-mission-planning__chip">10 Minutes Before</span>
              </div>
            </div>

            <div className="ls-mission-planning__actions">
              <a
                href={getGoogleCalendarUrl(launch, window.location.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="ls-btn ls-btn--ghost ls-btn--calendar"
                onClick={() => trackCalendarEvent("calendar_google_click", { launchId: launch.id, launchName: launch.name })}
              >
                <svg className="ls-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Add to Google Calendar
              </a>
              
              <a
                href={getOutlookCalendarUrl(launch, window.location.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="ls-btn ls-btn--ghost ls-btn--calendar"
                onClick={() => trackCalendarEvent("calendar_outlook_click", { launchId: launch.id, launchName: launch.name })}
              >
                <svg className="ls-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Add to Outlook
              </a>
              
              <button
                type="button"
                className="ls-btn ls-btn--ghost ls-btn--calendar"
                onClick={() => {
                  trackCalendarEvent("calendar_ics_download", { launchId: launch.id, launchName: launch.name });
                  downloadIcsFile(launch, window.location.href);
                }}
              >
                <svg className="ls-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download .ICS
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal className="ls-mission-specs" delay={0.08}>
          <h2 className="ls-section-title">Technical information</h2>
          <div className="ls-mission-specs__grid">
            {specs.map((spec) => (
              <div key={spec.label} className="ls-mission-spec">
                <span className="ls-mission-spec__label">{spec.label}</span>
                <span className="ls-mission-spec__value">{spec.value}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="ls-mission-timeline" delay={0.12}>
          <h2 className="ls-section-title">Mission timeline</h2>
          <ol className="ls-timeline">
            {timeline.map((item, i) => (
              <li key={item.phase} className="ls-timeline__item">
                <div className="ls-timeline__marker" aria-hidden="true">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="ls-timeline__content">
                  <h3>{item.phase}</h3>
                  <p>{item.detail}</p>
                  {item.time && (
                    <time className="ls-timeline__time">{item.time}</time>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </article>
  );
}
