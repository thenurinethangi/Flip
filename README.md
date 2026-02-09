# Flip

Flip is a production‑grade personal productivity suite that unifies planning, focus, and follow‑through in one polished mobile experience. It’s inspired by the workflow clarity of TickTick and the flexible knowledge style of Notion—combining daily execution, rich notes, and structured scheduling so users can plan, act, and stay consistent without app‑hopping. Flip is designed for real‑world use at scale: fast interactions, live data updates, and repeat‑aware scheduling that keeps routines accurate over time.

## Key functionality

Below is a comprehensive view of the core features currently supported by Flip:

- **Tasks**: Create, edit, complete, postpone, and reschedule tasks with priorities, tags, reminders, and repeat options.
- **Subtasks**: Add subtasks with independent status and scheduling, including their own notes and attachments.
- **Rich notes**: Attach rich‑text notes to tasks and subtasks (Notion‑style note blocks).
- **Attachments**: Add files, images, and links to both tasks and subtasks.
- **Focus & Pomodoro**: Dedicated focus sessions with break guidance to build consistent deep‑work routines.
- **Notification scheduling**: Reminders and time‑based prompts to keep momentum without missing deadlines.
- **Calendar view**: Navigate by date and view tasks scoped to a selected day.
- **Countdowns**: Create countdowns by type (Holiday, Birthday, Anniversary, Countdown) for long‑range planning.
- **Repeat rules**: Daily, weekly (Monday), and monthly (1st) repeat generation with duplication safety guards.
- **Real‑time updates**: UI reflects changes instantly via Firestore subscriptions.
- **Prioritization**: Visual priority indicators for immediate task triage.
- **Tagging & categorization**: Organize tasks by type and tags.
- **Rescheduling**: Move tasks forward with single‑tap date adjustments.

## Tech stack

- **React Native** with **Expo**
- **TypeScript**
- **Expo Router** (file-based routing)
- **Firebase Firestore** (tasks, subtasks, notes, attachments)
- **Local notifications** (scheduled reminders)
- **AsyncStorage** (repeat guards)
- **NativeWind/Tailwind** for styling
- **react-native-calendars** for calendar UI
- **Rich text editor** (notes and formatting)

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Expo CLI (optional, `npx` works without global install)

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npx expo start
```

Open with:

- **Expo Go** (quick preview)
- **Android emulator**
- **iOS simulator**
- **Development build** (recommended for native modules)

## Project structure

```
app/                # Screens (Expo Router)
components/         # Reusable UI and modals
services/           # Firestore + data access
assets/             # Images and static assets
```

## Notes

- Firebase configuration is located in services/firebase.ts.
- Repeat generation runs when subscribing to daily tasks/subtasks for the current date.

## Scripts

- `npx expo start` — start the dev server
- `npm run reset-project` — reset Expo starter structure (optional)
