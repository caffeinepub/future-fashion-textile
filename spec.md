# Daily Routine Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Daily routine/habit tracker app with full CRUD for tasks/habits
- Tasks organized by time of day: Morning, Afternoon, Evening, Night
- Mark tasks as complete/incomplete for the current day
- Daily progress tracking (percentage of tasks completed)
- Streak tracking (consecutive days of completing all tasks)
- Admin/management panel to add, edit, delete routine tasks
- User-friendly dashboard showing today's routine

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend (Motoko)
- `RoutineTask` type: id, title, description, category (Morning/Afternoon/Evening/Night), order, isActive
- `DailyLog` type: date (Text), taskId, completed (Bool)
- CRUD for RoutineTask: addTask, updateTask, deleteTask, getTasks
- Daily log: markTaskComplete, markTaskIncomplete, getDailyLog(date)
- Progress: getDailyProgress(date) returns completed/total count
- Streak: getStreak() calculates consecutive completed days

### Frontend
- Dashboard/Home page: Today's date, progress bar, tasks grouped by time of day
- Each task card: title, category, checkbox to mark complete
- Progress bar showing % of tasks done today
- Manage Tasks page: add, edit, delete routine tasks
- Simple, clean, motivating design
- Mobile responsive
