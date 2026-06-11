export const LAUNCH_STATES = {
  UPCOMING: "UPCOMING",
  IN_FLIGHT: "IN_FLIGHT",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
  HOLD: "HOLD",
  TBD: "TBD",
};

const STATUS_MAP = {
  "Go for Launch": LAUNCH_STATES.UPCOMING,
  "Go": LAUNCH_STATES.UPCOMING,
  "Upcoming": LAUNCH_STATES.UPCOMING,
  "Launch Successful": LAUNCH_STATES.SUCCESS,
  "Success": LAUNCH_STATES.SUCCESS,
  "Launch Failure": LAUNCH_STATES.FAILURE,
  "Failure": LAUNCH_STATES.FAILURE,
  "Partial Failure": LAUNCH_STATES.FAILURE,
  "In Flight": LAUNCH_STATES.IN_FLIGHT,
  "To Be Determined": LAUNCH_STATES.TBD,
  "TBD": LAUNCH_STATES.TBD,
  "On Hold": LAUNCH_STATES.HOLD,
  "Hold": LAUNCH_STATES.HOLD,
};

export function getNormalizedStatus(statusName) {
  if (!statusName) return LAUNCH_STATES.TBD;
  const trimmed = statusName.trim();

  // 1. Exact match first (case-insensitive key match)
  const statusLower = trimmed.toLowerCase();
  for (const [key, value] of Object.entries(STATUS_MAP)) {
    if (key.toLowerCase() === statusLower) {
      return value;
    }
  }

  // 2. Substring fallback matching
  if (statusLower.includes("success") || statusLower.includes("successful")) {
    return LAUNCH_STATES.SUCCESS;
  }
  if (statusLower.includes("fail") || statusLower.includes("failed")) {
    return LAUNCH_STATES.FAILURE;
  }
  if (statusLower.includes("hold")) {
    return LAUNCH_STATES.HOLD;
  }
  if (statusLower.includes("flight")) {
    return LAUNCH_STATES.IN_FLIGHT;
  }
  if (
    statusLower.includes("go for launch") ||
    statusLower === "go" ||
    statusLower.includes("upcoming")
  ) {
    return LAUNCH_STATES.UPCOMING;
  }
  if (
    statusLower.includes("tbd") ||
    statusLower.includes("to be determined") ||
    statusLower.includes("to be confirmed")
  ) {
    return LAUNCH_STATES.TBD;
  }

  return LAUNCH_STATES.TBD;
}

export function normalizeLaunchStatus(statusName) {
  const state = getNormalizedStatus(statusName);
  if (state === LAUNCH_STATES.UPCOMING) return "go";
  if (state === LAUNCH_STATES.SUCCESS) return "success";
  if (state === LAUNCH_STATES.FAILURE) return "failure";
  if (state === LAUNCH_STATES.HOLD || state === LAUNCH_STATES.TBD) return "tbd";
  if (state === LAUNCH_STATES.IN_FLIGHT) return "success";
  return "tbd";
}

export function matchesStatusFilter(launch, filterValue) {
  if (!filterValue || filterValue === "All") return true;

  const launchStatus = normalizeLaunchStatus(launch?.status?.name);
  const target = filterValue.toLowerCase();

  return launchStatus === target;
}

export function getUniqueStatusBuckets(launches) {
  const buckets = new Set();
  launches.forEach((launch) => {
    const bucket = normalizeLaunchStatus(launch?.status?.name);
    if (bucket) buckets.add(bucket);
  });
  return buckets;
}
