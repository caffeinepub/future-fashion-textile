import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  CATEGORY_ORDER,
  type RoutineTask,
  type TaskCategory,
  getTodayCompletions,
  toggleCompletion,
} from "@/utils/routineStorage";
import {
  CheckCircle2,
  CloudSun,
  Flame,
  Moon,
  Star,
  Sun,
  Sunset,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

interface DashboardPageProps {
  tasks: RoutineTask[];
  completions: Record<string, boolean>;
  onCompletionChange: (completions: Record<string, boolean>) => void;
  streak: number;
}

const CATEGORY_CONFIG: Record<
  TaskCategory,
  {
    label: string;
    icon: React.ElementType;
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    iconColor: string;
    timeHint: string;
  }
> = {
  Morning: {
    label: "Morning",
    icon: Sun,
    bg: "bg-amber-50",
    border: "border-amber-200",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    iconColor: "text-amber-500",
    timeHint: "6 AM – 12 PM",
  },
  Afternoon: {
    label: "Afternoon",
    icon: CloudSun,
    bg: "bg-sky-50",
    border: "border-sky-200",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    iconColor: "text-sky-500",
    timeHint: "12 PM – 6 PM",
  },
  Evening: {
    label: "Evening",
    icon: Sunset,
    bg: "bg-violet-50",
    border: "border-violet-200",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    iconColor: "text-violet-500",
    timeHint: "6 PM – 9 PM",
  },
  Night: {
    label: "Night",
    icon: Moon,
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-900",
    iconColor: "text-indigo-600",
    timeHint: "9 PM – 12 AM",
  },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getProgressColor(pct: number): string {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

function getProgressMessage(pct: number, done: number, total: number): string {
  if (total === 0) return "No tasks yet — add some in Manage Tasks!";
  if (pct === 100) return "Incredible! You've completed everything today! 🎉";
  if (pct >= 80) return "Almost there! You're doing amazing today.";
  if (pct >= 50)
    return `Halfway through! Keep going — ${total - done} more to go.`;
  if (pct > 0) return `Good start! ${done} done, ${total - done} to go.`;
  return "Let's start the day strong — check off your first task!";
}

export function DashboardPage({
  tasks,
  completions,
  onCompletionChange,
  streak,
}: DashboardPageProps) {
  const today = new Date();
  const todayCompletions = useMemo(
    () => getTodayCompletions(completions),
    [completions],
  );

  const activeTasks = tasks.filter((t) => t.isActive);
  const totalCount = activeTasks.length;
  const doneCount = activeTasks.filter(
    (t) => todayCompletions[t.id] === true,
  ).length;
  const pct = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);

  const tasksByCategory = useMemo(() => {
    const map: Record<TaskCategory, RoutineTask[]> = {
      Morning: [],
      Afternoon: [],
      Evening: [],
      Night: [],
    };
    for (const task of activeTasks) {
      map[task.category].push(task);
    }
    for (const cat of CATEGORY_ORDER) {
      map[cat].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return map;
  }, [activeTasks]);

  const allDone = totalCount > 0 && doneCount === totalCount;

  // For per-task index markers across all categories
  const [taskIndexMap] = useState(() => {
    const map: Record<string, number> = {};
    let idx = 1;
    for (const cat of CATEGORY_ORDER) {
      for (const t of tasksByCategory[cat]) {
        map[t.id] = idx++;
      }
    }
    return map;
  });

  function handleCheck(taskId: string, checked: boolean) {
    const updated = toggleCompletion(taskId, checked);
    onCompletionChange(updated);
  }

  return (
    <main
      data-ocid="dashboard.page"
      className="max-w-2xl mx-auto px-4 pb-16 pt-6"
    >
      {/* Date */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-center"
      >
        <p className="text-sm font-cabinet text-muted-foreground uppercase tracking-widest mb-1">
          Today
        </p>
        <h1 className="font-display text-2xl md:text-3xl text-foreground font-semibold">
          {formatDate(today)}
        </h1>
      </motion.div>

      {/* Progress Panel */}
      <motion.div
        data-ocid="progress.panel"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="rounded-2xl border border-border bg-card shadow-card p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-cabinet text-xs text-muted-foreground uppercase tracking-widest">
              Daily Progress
            </span>
            <p className="font-display text-xl font-semibold mt-0.5">
              {doneCount} / {totalCount} tasks
            </p>
          </div>
          <div className="text-right">
            <span
              className={`font-display text-3xl font-bold ${
                pct >= 80
                  ? "text-emerald-600"
                  : pct >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
              }`}
            >
              {pct}%
            </span>
          </div>
        </div>
        <div className="h-3 rounded-full bg-muted overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-all ${getProgressColor(pct)}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground font-sans">
          {getProgressMessage(pct, doneCount, totalCount)}
        </p>
      </motion.div>

      {/* Streak Panel */}
      {streak > 0 && (
        <motion.div
          data-ocid="streak.panel"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 mb-6 flex items-center gap-3"
        >
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-cabinet font-semibold text-amber-900 text-sm">
              🔥 {streak}-day streak!
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Consistency is the key to greatness. Keep it going!
            </p>
          </div>
        </motion.div>
      )}

      {/* All Done Celebration */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 mb-6 text-center"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-display text-lg font-semibold text-emerald-800">
              All done for today!
            </p>
            <p className="text-sm text-emerald-700 mt-1">
              MashAllah! You've completed your full daily routine. Rest well.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Groups */}
      {CATEGORY_ORDER.map((cat, catIdx) => {
        const catTasks = tasksByCategory[cat];
        if (catTasks.length === 0) return null;
        const cfg = CATEGORY_CONFIG[cat];
        const Icon = cfg.icon;
        const catDone = catTasks.filter(
          (t) => todayCompletions[t.id] === true,
        ).length;

        return (
          <motion.section
            key={cat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 + catIdx * 0.08 }}
            className="mb-5"
          >
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-8 h-8 rounded-lg ${cfg.bg} ${cfg.border} border flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <h2 className="font-cabinet font-semibold text-foreground text-sm uppercase tracking-wider">
                  {cfg.label}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {cfg.timeHint}
                </span>
              </div>
              <span className="text-xs font-cabinet text-muted-foreground">
                {catDone}/{catTasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-2">
              {catTasks.map((task) => {
                const idx = taskIndexMap[task.id] ?? 1;
                const isDone = todayCompletions[task.id] === true;
                return (
                  <motion.div
                    key={task.id}
                    data-ocid={`task.item.${idx}`}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl border ${cfg.border} bg-card shadow-xs p-4 flex items-start gap-3 transition-all duration-200 ${
                      isDone ? "opacity-60" : "hover:shadow-card"
                    }`}
                  >
                    <Checkbox
                      data-ocid={`task.checkbox.${idx}`}
                      id={`check-${task.id}`}
                      checked={isDone}
                      onCheckedChange={(v) => handleCheck(task.id, Boolean(v))}
                      className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${
                        isDone
                          ? "border-emerald-400 data-[state=checked]:bg-emerald-500"
                          : `${cfg.border}`
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={`check-${task.id}`}
                        className={`font-cabinet font-medium text-sm cursor-pointer block transition-all duration-200 ${
                          isDone
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </label>
                      {task.description && (
                        <p
                          className={`text-xs mt-0.5 transition-all duration-200 ${
                            isDone
                              ? "text-muted-foreground/60"
                              : "text-muted-foreground"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      className={`${cfg.badgeBg} ${cfg.badgeText} border-0 text-xs font-cabinet flex-shrink-0`}
                    >
                      {cat}
                    </Badge>
                    {isDone && (
                      <Star className="w-4 h-4 text-amber-400 flex-shrink-0 fill-amber-400" />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        );
      })}

      {activeTasks.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="font-display text-lg mb-2">No active tasks</p>
          <p className="text-sm">
            Go to Manage Tasks to add your daily routines.
          </p>
        </div>
      )}
    </main>
  );
}
