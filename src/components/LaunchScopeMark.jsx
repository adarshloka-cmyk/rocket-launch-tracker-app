/**
 * Launch Scope — aerospace mark
 * L-shaped launch vector + orbital arc + scope reticle
 */
export default function LaunchScopeMark({ className = "", size = 32 }) {
  return (
    <svg
      className={`ls-mark ${className}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="14"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.35"
      />
      <path
        d="M26 8a10 10 0 0 1 6 9.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.5"
        strokeLinecap="round"
      />
      <path
        d="M12 30V14c0-1.1.9-2 2-2h8"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle
        cx="28"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeOpacity="0.7"
      />
      <path
        d="M28 9.5v5M25.5 12h5"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.85"
        strokeLinecap="round"
      />
    </svg>
  );
}
