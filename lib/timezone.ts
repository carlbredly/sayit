import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import {
  DEFAULT_SHOW_DURATION_MINUTES,
  DEFAULT_SHOW_TIME,
  DEFAULT_TIMEZONE,
} from "@/lib/constants";

export type ShowPhase = "before" | "live" | "after";

export type ShowSchedule = {
  timezone: string;
  showTime: string;
  durationMinutes: number;
};

export function parseShowTime(showTime: string) {
  const [h, m] = showTime.split(":").map((part) => Number.parseInt(part, 10));
  return {
    hours: Number.isFinite(h) ? h : 10,
    minutes: Number.isFinite(m) ? m : 0,
  };
}

export function getNextShowStart(
  now = new Date(),
  schedule: ShowSchedule = {
    timezone: DEFAULT_TIMEZONE,
    showTime: DEFAULT_SHOW_TIME,
    durationMinutes: DEFAULT_SHOW_DURATION_MINUTES,
  }
) {
  const { hours, minutes } = parseShowTime(schedule.showTime);
  const zonedNow = toZonedTime(now, schedule.timezone);
  const day = zonedNow.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7;

  const wallTime = new Date(
    zonedNow.getFullYear(),
    zonedNow.getMonth(),
    zonedNow.getDate() + daysUntilSaturday,
    hours,
    minutes,
    0,
    0
  );

  let start = fromZonedTime(wallTime, schedule.timezone);
  const end = new Date(start.getTime() + schedule.durationMinutes * 60_000);

  if (now >= end) {
    wallTime.setDate(wallTime.getDate() + 7);
    start = fromZonedTime(wallTime, schedule.timezone);
  }

  return start;
}

export function getShowEnd(start: Date, durationMinutes: number) {
  return new Date(start.getTime() + durationMinutes * 60_000);
}

export function getShowPhase(
  now: Date,
  start: Date,
  durationMinutes: number
): ShowPhase {
  const end = getShowEnd(start, durationMinutes);
  if (now < start) return "before";
  if (now < end) return "live";
  return "after";
}

export function resolveShowPhase(
  now: Date,
  start: Date,
  durationMinutes: number,
  override?: string | null
): ShowPhase {
  if (override === "live") return "live";
  if (override === "off") {
    return now < start ? "before" : "after";
  }
  return getShowPhase(now, start, durationMinutes);
}

export function formatShowTimeLabel(showTime: string, timezone: string) {
  const { hours, minutes } = parseShowTime(showTime);
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  const minute = minutes.toString().padStart(2, "0");
  const zone = timezone === "America/New_York" ? "New York" : timezone;
  return `${hour12}:${minute} ${period} ${zone} Time`;
}

export function formatDateTime(date: Date | string, timezone = DEFAULT_TIMEZONE) {
  const value = typeof date === "string" ? new Date(date) : date;
  const zoned = toZonedTime(value, timezone);
  return `${format(zoned, "MMM d, yyyy · h:mm a")}`;
}
