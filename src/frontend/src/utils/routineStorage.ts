export type TaskCategory = "Morning" | "Afternoon" | "Evening" | "Night";

export interface RoutineTask {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  sortOrder: number;
  isActive: boolean;
}

const TASKS_KEY = "dailyRoutine_tasks";
const COMPLETIONS_KEY = "dailyRoutine_completions";

export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const DEFAULT_TASKS: RoutineTask[] = [
  {
    id: "t1",
    title: "Wake up & stretch",
    description: "Start the day with a gentle stretch routine",
    category: "Morning",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "t2",
    title: "Drink water",
    description: "2 glasses of water on an empty stomach",
    category: "Morning",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "t3",
    title: "Morning prayer / Fajr",
    description: "Begin the day with gratitude and prayer",
    category: "Morning",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "t4",
    title: "Healthy breakfast",
    description: "Nutritious meal to fuel the morning",
    category: "Morning",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "t5",
    title: "Lunch break",
    description: "Step away from work and eat mindfully",
    category: "Afternoon",
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "t6",
    title: "Short walk",
    description: "10-15 minutes of fresh air after lunch",
    category: "Afternoon",
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "t7",
    title: "Review daily goals",
    description: "Check progress on today's priorities",
    category: "Afternoon",
    sortOrder: 7,
    isActive: true,
  },
  {
    id: "t8",
    title: "Exercise / workout",
    description: "30 minutes of physical activity",
    category: "Evening",
    sortOrder: 8,
    isActive: true,
  },
  {
    id: "t9",
    title: "Read for 20 mins",
    description: "Expand your mind with a good book",
    category: "Evening",
    sortOrder: 9,
    isActive: true,
  },
  {
    id: "t10",
    title: "Plan tomorrow",
    description: "Write down 3 priorities for the next day",
    category: "Evening",
    sortOrder: 10,
    isActive: true,
  },
  {
    id: "t11",
    title: "Evening prayer / Isha",
    description: "End the day with reflection and prayer",
    category: "Night",
    sortOrder: 11,
    isActive: true,
  },
  {
    id: "t12",
    title: "No screen time",
    description: "Avoid phones and screens 1 hour before bed",
    category: "Night",
    sortOrder: 12,
    isActive: true,
  },
  {
    id: "t13",
    title: "Sleep by 10 PM",
    description: "Consistent sleep schedule for better rest",
    category: "Night",
    sortOrder: 13,
    isActive: true,
  },
];

export function loadTasks(): RoutineTask[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (raw) return JSON.parse(raw) as RoutineTask[];
  } catch {
    // ignore
  }
  // Seed defaults
  saveTasks(DEFAULT_TASKS);
  return DEFAULT_TASKS;
}

export function saveTasks(tasks: RoutineTask[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function loadCompletions(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(COMPLETIONS_KEY);
    if (raw) return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    // ignore
  }
  return {};
}

export function saveCompletions(completions: Record<string, boolean>): void {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

export function toggleCompletion(
  taskId: string,
  value: boolean,
): Record<string, boolean> {
  const completions = loadCompletions();
  const key = `${getTodayKey()}:${taskId}`;
  completions[key] = value;
  saveCompletions(completions);
  return completions;
}

export function getTodayCompletions(
  completions: Record<string, boolean>,
): Record<string, boolean> {
  const today = getTodayKey();
  const result: Record<string, boolean> = {};
  for (const k in completions) {
    if (k.startsWith(`${today}:`)) {
      const taskId = k.slice(today.length + 1);
      result[taskId] = completions[k];
    }
  }
  return result;
}

export function calculateStreak(
  tasks: RoutineTask[],
  completions: Record<string, boolean>,
): number {
  const activeTasks = tasks.filter((t) => t.isActive);
  if (activeTasks.length === 0) return 0;

  let streak = 0;
  const today = new Date();

  // Check yesterday first (today in progress doesn't break streak)
  for (let i = 1; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dk = dateKey(d);
    const allDone = activeTasks.every(
      (t) => completions[`${dk}:${t.id}`] === true,
    );
    if (allDone) {
      streak++;
    } else {
      break;
    }
  }

  // Also count today if all done
  const todayDk = getTodayKey();
  const todayAllDone = activeTasks.every(
    (t) => completions[`${todayDk}:${t.id}`] === true,
  );
  if (todayAllDone) streak++;

  return streak;
}

export function generateId(): string {
  return `t${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const CATEGORY_ORDER: TaskCategory[] = [
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
];
