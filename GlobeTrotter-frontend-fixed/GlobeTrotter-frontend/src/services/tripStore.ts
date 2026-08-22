import { Trip } from "../types";
import { trips as seedTrips } from "../data/mock";

const STORAGE_KEY = "globetrotter_created_trips";
const EVENT_NAME = "globetrotter:trips-updated";

export function getCreatedTrips(): Trip[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Trip[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function getAllTrips(): Trip[] { return [...seedTrips, ...getCreatedTrips()]; }

export function saveCreatedTrip(trip: Trip) {
  if (typeof window === "undefined") return;
  const current = getCreatedTrips().filter((item) => item.id !== trip.id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, trip]));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function subscribeToTrips(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getTripById(id: string): Trip | undefined { return getAllTrips().find((trip) => trip.id === id); }
