import type { SiteConfig } from "./config";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const DAY_ORDER: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DAY_LABELS: Record<DayKey, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

export interface OpenStatus {
  isOpen: boolean;
  label: string;
  shortLabel: string;
  is24x7: boolean;
}

function parseMinutes(hhmm: string): number {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr ?? 0);
  const m = Number(mStr ?? 0);
  return h * 60 + m;
}

export function formatTime12h(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h24 = Number(hStr ?? 0);
  const m = Number(mStr ?? 0);
  const period = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  if (m === 0) return `${h12}:00 ${period}`;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatCompactTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h24 = Number(hStr ?? 0);
  const m = Number(mStr ?? 0);
  const period = h24 >= 12 ? "pm" : "am";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  if (m === 0) return `${h12}${period}`;
  return `${h12}:${String(m).padStart(2, "0")}${period}`;
}

export function computeOpenStatus(hours: SiteConfig["hours"], now: Date = new Date()): OpenStatus {
  if (hours.is24x7) {
    return {
      isOpen: true,
      label: "Open 24/7",
      shortLabel: "Open 24/7",
      is24x7: true,
    };
  }

  const timeZone = hours.timezone || "America/Phoenix";
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekdayRaw = (parts.find((p) => p.type === "weekday")?.value ?? "Mon").toLowerCase().slice(0, 3) as DayKey;
  const hourRaw = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minuteRaw = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const currentMinutes = (hourRaw === 24 ? 0 : hourRaw) * 60 + minuteRaw;

  const todaySlot = hours.schedule[weekdayRaw];
  if (todaySlot) {
    const [openStr, closeStr] = todaySlot;
    const openMin = parseMinutes(openStr);
    const closeMin = parseMinutes(closeStr);

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      return {
        isOpen: true,
        label: "Open now",
        shortLabel: "Open now",
        is24x7: false,
      };
    }

    if (currentMinutes < openMin) {
      if (hours.emergencyAfterHours) {
        return {
          isOpen: false,
          label: "Closed · call for emergency",
          shortLabel: "Closed · call for emergency",
          is24x7: false,
        };
      }
      const openTime = formatTime12h(openStr);
      return {
        isOpen: false,
        label: `Opens at ${openTime}`,
        shortLabel: `Opens at ${openTime}`,
        is24x7: false,
      };
    }
  }

  if (hours.emergencyAfterHours) {
    return {
      isOpen: false,
      label: "Closed · call for emergency",
      shortLabel: "Closed · call for emergency",
      is24x7: false,
    };
  }

  // Find next open day
  const startIdx = DAY_ORDER.indexOf(weekdayRaw);
  for (let offset = 1; offset <= 7; offset++) {
    const dayKey = DAY_ORDER[(startIdx + offset) % 7]!;
    const slot = hours.schedule[dayKey];
    if (slot) {
      const openTime = formatTime12h(slot[0]);
      if (offset === 1) {
        return {
          isOpen: false,
          label: `Opens tomorrow at ${openTime}`,
          shortLabel: `Opens at ${openTime}`,
          is24x7: false,
        };
      }
      return {
        isOpen: false,
        label: `Opens ${DAY_LABELS[dayKey]} at ${openTime}`,
        shortLabel: `Opens ${DAY_LABELS[dayKey]} ${openTime}`,
        is24x7: false,
      };
    }
  }

  return {
    isOpen: false,
    label: "Closed",
    shortLabel: "Closed",
    is24x7: false,
  };
}

export function formatHoursSummary(hours: SiteConfig["hours"]): string {
  if (hours.is24x7) {
    return "Open 24/7, 7 days a week";
  }

  const orderedDays: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const groups: Array<{ days: DayKey[]; slot: [string, string] | null }> = [];

  for (const day of orderedDays) {
    const slot = hours.schedule[day];
    const prev = groups[groups.length - 1];
    const sameAsPrev =
      prev &&
      ((prev.slot === null && slot === null) ||
        (prev.slot !== null && slot !== null && prev.slot[0] === slot[0] && prev.slot[1] === slot[1]));

    if (sameAsPrev && prev) {
      prev.days.push(day);
    } else {
      groups.push({ days: [day], slot });
    }
  }

  const parts = groups
    .filter((g) => g.slot !== null)
    .map((g) => {
      const first = DAY_LABELS[g.days[0]!];
      const last = DAY_LABELS[g.days[g.days.length - 1]!];
      const daySpan = g.days.length > 1 ? `${first}–${last}` : first;
      const [openStr, closeStr] = g.slot!;
      return `${daySpan} ${formatCompactTime(openStr)}–${formatCompactTime(closeStr)}`;
    });

  if (hours.emergencyAfterHours) {
    parts.push("Emergency calls after hours");
  }

  return parts.join(" · ");
}

export function getOpeningHoursSpec(hours: SiteConfig["hours"]) {
  if (hours.is24x7) {
    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ];
  }

  const fullNames: Record<DayKey, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  const specs: Array<{
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string;
    opens: string;
    closes: string;
  }> = [];

  (Object.keys(fullNames) as DayKey[]).forEach((day) => {
    const slot = hours.schedule[day];
    if (slot) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: fullNames[day],
        opens: slot[0],
        closes: slot[1],
      });
    }
  });

  return specs;
}
