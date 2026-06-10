/**
 * Helper to format a Date or ISO string into basic ISO 8601 UTC format (YYYYMMDDTHHmmssZ).
 * Ensures UTC handling without hardcoding timezone offsets.
 * @param {string|Date} dateStr 
 * @returns {string}
 */
export function toBasicISO(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Calculates start and end times for the calendar event.
 * If launch.window_end is present and after launch.net, use actual duration.
 * Otherwise, default to a 1 hour duration.
 * @param {object} launch 
 * @returns {{startStr: string, endStr: string}}
 */
export function getEventTimes(launch) {
  const start = new Date(launch.net);
  if (isNaN(start.getTime())) {
    return { startStr: "", endStr: "" };
  }

  let end;
  if (launch.window_end) {
    const windowEnd = new Date(launch.window_end);
    if (!isNaN(windowEnd.getTime()) && windowEnd.getTime() > start.getTime()) {
      end = windowEnd;
    }
  }

  // Fallback to 1 hour duration
  if (!end) {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  return {
    startStr: toBasicISO(start),
    endStr: toBasicISO(end)
  };
}

/**
 * Compiles a detailed multi-line text description for the calendar event.
 * Matches user requirements and example layout.
 * @param {object} launch 
 * @param {string} launchScopeUrl 
 * @returns {string}
 */
export function getEnhancedDescription(launch, launchScopeUrl) {
  const missionName = launch.name || "N/A";
  const rocketName = launch.rocket?.configuration?.full_name || launch.rocket?.configuration?.name || "N/A";
  const provider = launch.launch_service_provider?.name || "N/A";
  const site = launch.pad?.name || "";
  const locationName = launch.pad?.location?.name || "";
  const fullSite = [site, locationName].filter(Boolean).join(", ") || "N/A";
  const rawDate = launch.net ? new Date(launch.net) : null;
  const formattedDate = rawDate ? rawDate.toUTCString() : "N/A";
  const description = launch.mission?.description || "No mission description available.";

  return `Mission: ${missionName}

Rocket:
${rocketName}

Provider:
${provider}

Launch Site:
${fullSite}

Launch Date & Time (UTC):
${formattedDate}

Description:
${description}

View Launch:
${launchScopeUrl}`;
}

/**
 * Generates pre-filled Google Calendar URL.
 * @param {object} launch 
 * @param {string} launchScopeUrl 
 * @returns {string}
 */
export function getGoogleCalendarUrl(launch, launchScopeUrl) {
  const { startStr, endStr } = getEventTimes(launch);
  const title = launch.name || "Space Launch";
  const details = getEnhancedDescription(launch, launchScopeUrl);
  const site = launch.pad?.name || "";
  const locationName = launch.pad?.location?.name || "";
  const location = [site, locationName].filter(Boolean).join(", ") || "";

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startStr}/${endStr}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}

/**
 * Generates pre-filled Outlook Calendar URL.
 * @param {object} launch 
 * @param {string} launchScopeUrl 
 * @returns {string}
 */
export function getOutlookCalendarUrl(launch, launchScopeUrl) {
  const { startStr, endStr } = getEventTimes(launch);
  const title = launch.name || "Space Launch";
  const details = getEnhancedDescription(launch, launchScopeUrl);
  const site = launch.pad?.name || "";
  const locationName = launch.pad?.location?.name || "";
  const location = [site, locationName].filter(Boolean).join(", ") || "";

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(title)}&startdt=${startStr}&enddt=${endStr}&body=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}

/**
 * Generates a standards-compliant VCALENDAR/VEVENT ICS string.
 * @param {object} launch 
 * @param {string} launchScopeUrl 
 * @returns {string}
 */
export function generateIcs(launch, launchScopeUrl) {
  const { startStr, endStr } = getEventTimes(launch);
  const nowStr = toBasicISO(new Date());
  const summary = launch.name || "Space Launch";

  const site = launch.pad?.name || "";
  const locationName = launch.pad?.location?.name || "";
  const location = [site, locationName].filter(Boolean).join(", ") || "N/A";

  const description = getEnhancedDescription(launch, launchScopeUrl);

  // Escape special characters for RFC 5545 compatibility
  const escapeIcsText = (str) => {
    if (!str) return "";
    return str
      .replace(/\\/g, "\\\\")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\n/g, "\\n");
  };

  const escapedDescription = escapeIcsText(description);
  const escapedSummary = escapeIcsText(summary);
  const escapedLocation = escapeIcsText(location);
  const uid = `launch-${launch.id}-${startStr}@launchscope.app`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//LaunchScope//Launch Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${escapedSummary}`,
    `DESCRIPTION:${escapedDescription}`,
    `LOCATION:${escapedLocation}`,
    `URL:${launchScopeUrl}`,
    "ORGANIZER;CN=LaunchScope:mailto:noreply@launchscope.app",
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  // Perform line folding at 75 characters as per RFC 5545
  const foldedLines = lines.map(line => {
    if (line.length <= 75) {
      return line;
    }
    const chunks = [];
    let remaining = line;
    chunks.push(remaining.substring(0, 75));
    remaining = remaining.substring(75);
    while (remaining.length > 0) {
      chunks.push(" " + remaining.substring(0, 74));
      remaining = remaining.substring(74);
    }
    return chunks.join("\r\n");
  });

  return foldedLines.join("\r\n") + "\r\n";
}

/**
 * Triggers a client-side immediate download of the ICS file.
 * Filename is slugified based on launch name.
 * @param {object} launch 
 * @param {string} launchScopeUrl 
 */
export function downloadIcsFile(launch, launchScopeUrl) {
  const icsContent = generateIcs(launch, launchScopeUrl);
  const slug = (launch.name || "launch")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const fileName = `${slug}.ics`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lightweight tracking hook for future analytics.
 * Logs event triggers to the console and invokes analytics wrapper if active.
 * @param {string} eventName 
 * @param {object} eventData 
 */
export function trackCalendarEvent(eventName, eventData = {}) {
  console.log(`[Analytics Track] Event: ${eventName}`, eventData);
  
  if (typeof window !== "undefined" && window.analytics && typeof window.analytics.track === "function") {
    try {
      window.analytics.track(eventName, eventData);
    } catch (e) {
      console.warn("Analytics tracking failed", e);
    }
  }
}
