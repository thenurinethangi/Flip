# Flip

**Plan your everything. Master your day.**

Flip is not just another task management app—it’s a full productivity suite that helps you plan your day, week, month, and year in one place. Inspired by the workflow clarity of **TickTick** and the flexible, powerful editing of **Notion**, Flip is built for real-world use: high production quality, designed for daily use, and focused on making you more productive.

Whether you’re managing daily to-dos, long-term projects, or life events, Flip keeps everything organized, on time, and in focus.

---

## What Makes Flip Different?

Most apps only handle tasks. Flip combines:

- **Planning** — Day, week, month, and year views
- **Action** — Tasks, subtasks, reminders, and repeats
- **Focus** — Pomodoro-style deep work built in
- **Memory** — Notes, attachments, and countdowns for what matters

Everything in one polished mobile experience, so you can stay consistent without switching apps.

---

## Features

### 📅 Plan Your Entire Time Horizon

- **Day** — Focus on today’s priorities
- **Week** — See the full week at a glance
- **Month** — Monthly planning and overview
- **Year** — Long-term goals and milestones

### ✅ Tasks & Subtasks

- Create, edit, complete, postpone, and reschedule tasks
- Add **unlimited subtasks** — each with its own:
  - Due date and time  
  - Reminders  
  - Notes and attachments  
  - Repeat rules
- Visual priority indicators for quick triage
- Tags and categories to organize by type
- Single-tap rescheduling to move tasks forward

### ⏰ Smart Scheduling & Reminders

- **Repeat rules** — Daily, weekly (e.g., every Monday), monthly (e.g., 1st of month)
- **Flexible reminders**:
  - At the due time
  - 1 day before
  - 1 week before
  - Or any custom offset you prefer
- Duplication safety so repeat tasks don’t clutter your list
- Time-based prompts to keep momentum and never miss deadlines

### 📝 Notion-Style Notes & Formatting

- Rich-text notes on every task and subtask
- Notion-like blocks and formatting (bold, italic, lists, headings, etc.)
- Full editing experience for plans, ideas, and instructions inside each task

### 📎 Attachments

- **Files** — PDFs, documents, spreadsheets
- **Images** — Screenshots, reference photos
- **Videos** — Clips, tutorials, references
- Attach to both tasks and subtasks for complete context

### 📆 Calendar View

- Day-by-day calendar view of your schedule
- See all tasks for any selected date
- Quick access to what’s due and when
- Navigate easily through days, weeks, and months

### 🍅 Pomodoro Focus Mode

- Built-in **Pomodoro method** for deep work
- Run focus sessions on tasks and subtasks
- Break guidance and timers for sustainable focus
- **Focus time tracking** — see how much time you spent on each task
- Maximize productivity and consistency with structured focus blocks

### ⏳ Countdowns

- Count down to:
  - Birthdays  
  - Anniversaries  
  - Holidays  
  - Trips  
  - Any important date
- Set target dates and optional reminders
- Long-range planning and anticipation for life’s big moments

### 👤 Profile & Account

- Update your profile and account details
- **Logout** when you need to switch devices or accounts
- **Delete account** when you no longer need the app
- Full control over your data and identity

### 🎨 Themes & Appearance

- **Dark mode** and **light mode**
- Custom color themes
- Tailor the app to your preference and comfort

---

## Tech Stack

- **React Native** with **Expo** — Cross-platform mobile
- **TypeScript** — Type safety and maintainability
- **Expo Router** — File-based routing
- **Firebase Firestore** — Tasks, subtasks, notes, attachments (real-time sync)
- **Local notifications** — Scheduled reminders
- **AsyncStorage** — Repeat guards and local state
- **NativeWind/Tailwind** — Styling
- **react-native-calendars** — Calendar UI
- Rich text editor — Notion-style notes

---

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Expo CLI (optional; `npx` works without a global install)

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npx expo start
```

Then open with:

- **Expo Go** — Quick preview on your device
- **Android emulator**
- **iOS simulator**
- **Development build** — Recommended for native modules

---

## Project Structure

```
app/                # Screens (Expo Router)
components/         # Reusable UI and modals
services/           # Firestore and data access
assets/             # Images and static assets
```

---

## Notes

- Firebase configuration is in `services/firebase.ts`.
- Repeat generation runs when subscribing to daily tasks/subtasks for the current date.

## Scripts

- `npx expo start` — Start the dev server
- `npm run reset-project` — Reset Expo starter structure (optional)
