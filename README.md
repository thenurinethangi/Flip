# Flip

Flip is a production‑grade personal productivity suite that unifies planning, focus, and follow‑through in one polished mobile experience. It transcends conventional task management by enabling users to orchestrate their day, week, month, and entire year within a single application. Inspired by the workflow clarity of TickTick and the flexible knowledge‑building approach of Notion, Flip combines structured scheduling, rich contextual notes, and deep‑work facilitation so users can plan, act, and maintain consistency without app‑hopping.

Designed for real‑world use at scale, Flip delivers fast interactions, live data synchronization, and repeat‑aware scheduling that keeps routines accurate over time. Whether managing daily execution, long‑term projects, or life milestones, Flip provides the infrastructure for sustained productivity and intentional time management.

## Download

**[Download Flip APK for Android](https://expo.dev/accounts/nethangi/projects/Flip/builds/8b764a7a-adf0-49ac-a9bf-c718622f30ec)** — Get the latest build directly from Expo. Install on your Android device to start using Flip.

## Overview

Flip is not merely a task management application. It is a comprehensive productivity platform that supports end‑to‑end planning across multiple time horizons, from granular daily execution to annual goal tracking. Users can schedule tasks, configure reminders with flexible offsets, attach rich notes and media, and maintain full visibility of their commitments through integrated calendar views. The application incorporates proven productivity methodologies such as the Pomodoro technique for focused work sessions, alongside countdown functionality for milestone and event anticipation. Full account management, theme customization, and data control round out an experience built for demanding, daily use by productivity‑oriented individuals.

## Core Functionality

Below is a comprehensive view of the features currently supported by Flip.

### Tasks and Hierarchical Structure

Create, edit, complete, postpone, and reschedule tasks with full support for priorities, tags, reminders, and repeat rules. Each task can carry its own due date, time, and metadata. Flip extends this model with unlimited subtasks, where each subtask operates as an independent unit with its own due date, time, reminder configuration, repeat rules, notes, and attachments. This hierarchical yet granular structure allows users to decompose complex work into manageable units without losing independence at the subtask level. Visual priority indicators enable immediate triage, while tagging and categorization support organization by type and context. Single‑tap rescheduling facilitates rapid date adjustments when priorities shift.

### Scheduling and Reminder System

Tasks and subtasks support flexible scheduling with repeat rules that generate instances on daily, weekly (e.g., every Monday), and monthly (e.g., 1st of the month) cadences. Duplication safety guards prevent redundant entries when repeat logic runs. Reminders can be configured to fire at the due time, one day before, one week before, or according to custom offsets that suit the user's workflow. Time‑based notification prompts maintain momentum and reduce the likelihood of missed deadlines. The system is repeat‑aware and maintains accuracy as routines evolve over time.

### Rich Notes and Formatting

Attach rich‑text notes to tasks and subtasks using a Notion‑style editing experience. Support for note blocks, formatting (bold, italic, lists, headings, and related constructs), and structured content enables users to capture plans, instructions, and context directly within each item. The same editing capabilities apply at both task and subtask levels, providing a consistent knowledge‑building interface throughout the hierarchy.

### Attachments and Media

Add files, images, and video content to both tasks and subtasks. Supported attachment types include documents (PDFs, spreadsheets, and similar formats), images (screenshots, reference photos), and video clips. Attachments provide full contextual support for work items and ensure that relevant materials remain associated with the appropriate task or subtask.

### Calendar View

Navigate by date and view tasks scoped to a selected day through an integrated calendar interface. Users gain immediate access to what is due on any given date, with the ability to traverse days, weeks, and months. The calendar view complements list-based workflows by offering a time-oriented perspective on commitments and deadlines.

### Focus and Pomodoro Methodology

Dedicated focus sessions leverage the Pomodoro method to support consistent deep‑work routines. Users can run focus sessions against specific tasks and subtasks, with break guidance and timers to sustain sustainable concentration. Focus time is tracked per task and per user, enabling visibility into time invested across work items. This integration of structured focus blocks with task execution supports maximum productivity and measurable effort allocation.

### Countdowns and Milestone Tracking

Create countdowns by type—Holiday, Birthday, Anniversary, or generic Countdown—for long‑range planning and anticipation. Each countdown supports a target date and optional reminders, allowing users to track important events such as birthdays, anniversaries, holidays, and personal milestones. Countdowns exist independently of tasks and provide a dedicated mechanism for event-oriented planning.

### Real‑Time Synchronization

The user interface reflects changes instantly via Firestore subscriptions. Updates propagate across devices in real time, ensuring that the application state remains consistent and up to date regardless of where modifications originate.

### Profile and Account Management

Users can update profile and account details, log out when switching devices or accounts, and delete their account when the application is no longer needed. Full control over identity and data is maintained through these capabilities.

### Theming and Appearance

Support for dark mode and light mode, alongside configurable color themes, allows users to tailor the application's appearance to their preference and environment. Theme and color settings persist across sessions.

## Technical Architecture

### Tech Stack

Flip is built with React Native and Expo, using TypeScript for type safety and maintainability. Navigation is handled via Expo Router with file-based routing. Data persistence and real-time synchronization are provided by Firebase Firestore for tasks, subtasks, notes, and attachments. Local notifications handle scheduled reminders, while AsyncStorage supports repeat guards and local state. Styling is implemented with NativeWind/Tailwind. The calendar interface uses react-native-calendars, and rich text editing for notes and formatting is provided by a dedicated editor component.

### Project Structure

```
app/                # Screens (Expo Router)
components/         # Reusable UI and modals
services/           # Firestore and data access
assets/             # Images and static assets
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm
- Expo CLI (optional; `npx` works without global install)

### Installation

```bash
npm install
```

### Running the Application

```bash
npx expo start
```

The application can be opened via Expo Go for quick preview, an Android emulator, an iOS simulator, or a development build. A development build is recommended when using native modules.

### Configuration Notes

Firebase configuration is located in `services/firebase.ts`. Repeat generation runs when subscribing to daily tasks and subtasks for the current date.

## Available Scripts

- `npx expo start` — Start the development server
- `npm run reset-project` — Reset Expo starter structure (optional)

## Screenshots

![Flip](![photo_2026-02-14_00-31-57](https://github.com/user-attachments/assets/bdb50f83-a521-409a-ac14-20d1322b3802))
