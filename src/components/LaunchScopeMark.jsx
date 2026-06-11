/**
 * LaunchScope — minimal aerospace mark
 * Scope reticle motif — restrained, functional
 */
export default function LaunchScopeMark({ className = "", size = 28 }) {
  return (
    <svg
      className={`ls-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer scope ring */}
      <circle
        cx="14"
        cy="14"
        r="10"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
      />
      {/* Crosshair lines */}
      <line x1="14" y1="2" x2="14" y2="8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="14" y1="20" x2="14" y2="26" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="2" y1="14" x2="8" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="20" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
      {/* Center dot */}
      <circle cx="14" cy="14" r="2" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}
