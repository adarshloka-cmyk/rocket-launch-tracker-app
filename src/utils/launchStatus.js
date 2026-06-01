/**
 * Normalize SpaceDevs Launch Library status names for filter matching.
 * API values vary: "Go for Launch", "To Be Determined", "Launch Successful", etc.
 */
export function normalizeLaunchStatus(statusName) {
  const raw = (statusName || "").toLowerCase().trim();
  if (!raw) return "";

  if (raw.includes("go for launch") || raw === "go") return "go";
  if (
    raw.includes("tbd") ||
    raw.includes("to be determined") ||
    raw.includes("to be confirmed") ||
    raw.includes("hold")
  ) {
    return "tbd";
  }
  if (raw.includes("success")) return "success";
  if (raw.includes("fail")) return "failure";

  return raw;
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
