# Flip

Flip is a production‑grade personal productivity suite that unifies planning, focus, and follow‑through in one polished mobile experience. It combines task execution, calendar context, countdowns, and focus workflows so users can plan, act, and stay consistent without app‑hopping.

## Key functionality

- **Task management**: Create, edit, complete, postpone, and reschedule tasks with priorities, tags, reminders, and repeat options.
- **Subtasks**: Add and manage subtasks with independent status, notes, and attachments.
- **Focus & Pomodoro**: Dedicated focus sessions with break guidance to improve deep‑work routines.
- **Notification scheduling**: Reminders and time‑based prompts to stay on track.
- **Calendar view**: Navigate by date and see tasks scoped to a selected day.
- **Countdowns**: Create countdown items by type (Holiday, Birthday, Anniversary, Countdown).
- **Repeat rules**: Daily, weekly (Monday), and monthly (1st) repeat generation with duplication safety guards.
- **Notes and attachments**: Rich‑text notes and file attachments on tasks/subtasks.
- **Real‑time updates**: UI reflects changes instantly via Firestore subscriptions.

## Tech stack

- **React Native** with **Expo**
- **TypeScript**
- **Expo Router** (file-based routing)
- **Firebase Firestore** (tasks, subtasks, notes, attachments)
- **Local notifications** (scheduled reminders)
- **AsyncStorage** (repeat guards)
- **NativeWind/Tailwind** for styling
- **react-native-calendars** for calendar UI

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
