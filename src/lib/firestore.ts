import {
  db,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "./firebase";
import type { MeetingEvent, Availability, Booking } from "./types";

// Sort helpers — avoids composite index requirements
const byCreatedDesc = (a: { createdAt?: unknown }, b: { createdAt?: unknown }) => {
  const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
  const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
  return tb - ta;
};

// ── Meeting Events ──────────────────────────────────────────

export async function createMeetingEvent(event: MeetingEvent) {
  const docRef = await addDoc(collection(db, "meetingEvents"), {
    ...event,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getMeetingEventsByHost(hostId: string) {
  const q = query(
    collection(db, "meetingEvents"),
    where("hostId", "==", hostId)
  );
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as MeetingEvent[];
  return results.sort(byCreatedDesc);
}

export async function getMeetingEvent(eventId: string) {
  const snap = await getDoc(doc(db, "meetingEvents", eventId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as MeetingEvent;
}

export async function updateMeetingEvent(eventId: string, data: Partial<MeetingEvent>) {
  await updateDoc(doc(db, "meetingEvents", eventId), data as Record<string, unknown>);
}

export async function deleteMeetingEvent(eventId: string) {
  await deleteDoc(doc(db, "meetingEvents", eventId));
}

// ── Availability ────────────────────────────────────────────

export async function setAvailability(slots: Availability[]) {
  if (slots.length === 0) return;
  const userId = slots[0].userId;
  const existing = query(
    collection(db, "availability"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(existing);
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  await Promise.all(slots.map((slot) => addDoc(collection(db, "availability"), slot)));
}

export async function getAvailability(userId: string) {
  const q = query(
    collection(db, "availability"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Availability[];
}

// ── Bookings ────────────────────────────────────────────────

export async function createBooking(booking: Booking) {
  const docRef = await addDoc(collection(db, "bookings"), {
    ...booking,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getBookingsByHost(hostId: string) {
  const q = query(
    collection(db, "bookings"),
    where("hostId", "==", hostId)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Booking[];
  return results.sort(byCreatedDesc);
}

export async function getBookingsByEvent(eventId: string) {
  const q = query(
    collection(db, "bookings"),
    where("eventId", "==", eventId)
  );
  const snap = await getDocs(q);
  const results = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Booking[];
  return results.sort(byCreatedDesc);
}

export async function getBookingsByDate(eventId: string, date: string) {
  const q = query(
    collection(db, "bookings"),
    where("eventId", "==", eventId),
    where("date", "==", date),
    where("status", "==", "confirmed")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Booking[];
}

export async function updateBookingStatus(
  bookingId: string,
  status: Booking["status"]
) {
  await updateDoc(doc(db, "bookings", bookingId), { status });
}

// ── Realtime subscriptions ───────────────────────────────────

export function subscribeMeetingEventsByHost(
  hostId: string,
  onData: (events: MeetingEvent[]) => void
) {
  const q = query(
    collection(db, "meetingEvents"),
    where("hostId", "==", hostId)
  );
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as MeetingEvent[];
    onData(results.sort(byCreatedDesc));
  });
}

export function subscribeBookingsByHost(
  hostId: string,
  onData: (bookings: Booking[]) => void
) {
  const q = query(
    collection(db, "bookings"),
    where("hostId", "==", hostId)
  );
  return onSnapshot(q, (snapshot) => {
    const results = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Booking[];
    onData(results.sort(byCreatedDesc));
  });
}

export function subscribeAvailabilityByUserId(
  userId: string,
  onData: (slots: Availability[]) => void
) {
  const q = query(collection(db, "availability"), where("userId", "==", userId));
  return onSnapshot(q, (snapshot) => {
    onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Availability[]);
  });
}

export function subscribeBookedSlotsByEventAndDate(
  eventId: string,
  date: string,
  onData: (slots: Array<{ time: string; duration: number }>) => void
) {
  const q = query(
    collection(db, "bookings"),
    where("eventId", "==", eventId),
    where("date", "==", date),
    where("status", "==", "confirmed")
  );
  return onSnapshot(q, (snapshot) => {
    onData(
      snapshot.docs.map((d) => {
        const data = d.data() as Booking;
        return { time: data.time, duration: data.duration };
      })
    );
  });
}
