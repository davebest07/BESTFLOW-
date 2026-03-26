# Bestflow – Meeting Scheduler App

A full-stack meeting scheduler built with **Next.js 15**, **React**, **Firebase Firestore**, **TailwindCSS**, and **Kinde Auth**.

## Features

- **Create Event Types** – set up meetings with custom duration, location type, and theme color
- **Set Availability** – define weekly hours (per day toggle, start/end times)
- **Public Booking Page** – attendees pick a date → available time → enter details → confirmed
- **Real-time Firestore** – all meetings, availability, and bookings stored & synced via Firebase
- **Kinde Authentication** – secure login, protected routes, user-specific dashboards
- **Role-based Views** – hosts see management tools & booking list; attendees see a streamlined booking flow
- **Responsive UI** – works on desktop and mobile, dark-mode ready

## Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Framework      | Next.js 15 (App Router) |
| UI             | React, TailwindCSS      |
| Auth           | Kinde                   |
| Database       | Firebase Firestore      |
| Icons          | Lucide React            |
| Date Utilities | date-fns, react-day-picker |

## Getting Started

### 1. Clone & install

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) → create a project
2. Enable **Firestore Database** (start in test mode)
3. Go to Project Settings → Your Apps → Add a **Web App**
4. Copy the config values into `.env.local`

#### Kinde Setup
1. Sign up at [kinde.com](https://kinde.com/)
2. Create an application (choose **Next.js**)
3. Set these callback URLs in the Kinde dashboard:
   - **Allowed callback URL:** `http://localhost:3000/api/auth/kinde_callback`
   - **Allowed logout redirect:** `http://localhost:3000`
4. Copy Client ID, Client Secret, and Issuer URL into `.env.local`

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/           # Protected layout with sidebar
│   │   ├── dashboard/         # Main dashboard (events + bookings)
│   │   ├── create-meeting/    # Create new meeting event
│   │   └── availability/      # Set weekly availability
│   ├── booking/[eventId]/     # Public booking page (no auth required)
│   ├── api/auth/[kindeAuth]/  # Kinde auth route handler
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing page
├── components/
│   ├── Sidebar.tsx            # Dashboard sidebar navigation
│   ├── MeetingForm.tsx        # Create meeting form
│   ├── MeetingEventList.tsx   # Grid of meeting event cards
│   ├── AvailabilityForm.tsx   # Weekly availability editor
│   ├── BookingView.tsx        # Multi-step booking wizard
│   └── BookingList.tsx        # List of bookings (host view)
├── lib/
│   ├── firebase.ts            # Firebase initialization
│   ├── firestore.ts           # Firestore CRUD operations
│   ├── types.ts               # TypeScript interfaces & constants
│   └── utils.ts               # Utility functions
└── middleware.ts              # Kinde auth route protection
```

## Firestore Collections

| Collection       | Key Fields |
| ---------------- | ---------- |
| `meetingEvents`  | title, description, duration, locationType, hostId, hostName, hostEmail, themeColor, createdAt |
| `availability`   | userId, dayOfWeek, startTime, endTime, isActive |
| `bookings`       | eventId, hostId, attendeeName, attendeeEmail, date, time, duration, status, note, createdAt |

## License

MIT
