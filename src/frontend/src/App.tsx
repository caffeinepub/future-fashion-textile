import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { ArrowLeft, Settings, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { DashboardPage } from "./components/DashboardPage";
import { ManageTasksPage } from "./components/ManageTasksPage";
import {
  type RoutineTask,
  calculateStreak,
  loadCompletions,
  loadTasks,
  saveTasks,
} from "./utils/routineStorage";

type Page = "dashboard" | "manage";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [tasks, setTasks] = useState<RoutineTask[]>(() => loadTasks());
  const [completions, setCompletions] = useState<Record<string, boolean>>(() =>
    loadCompletions(),
  );
  const streak = calculateStreak(tasks, completions);

  // Persist tasks whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleTasksChange = useCallback((updated: RoutineTask[]) => {
    setTasks(updated);
  }, []);

  const handleCompletionChange = useCallback(
    (updated: Record<string, boolean>) => {
      setCompletions(updated);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-xs">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {page === "dashboard" ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Sun className="w-4 h-4 text-amber-600" />
                </div>
                <span className="font-display text-lg font-semibold text-foreground tracking-tight">
                  Daily Routine
                </span>
              </div>
              <Button
                data-ocid="manage.tasks.button"
                variant="outline"
                size="sm"
                className="gap-2 font-cabinet text-xs"
                onClick={() => setPage("manage")}
              >
                <Settings className="w-3.5 h-3.5" />
                Manage Tasks
              </Button>
            </>
          ) : (
            <>
              <Button
                data-ocid="nav.link"
                variant="ghost"
                size="sm"
                className="gap-2 font-cabinet text-sm -ml-2"
                onClick={() => setPage("dashboard")}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <span className="font-display text-base font-semibold text-foreground">
                Manage Tasks
              </span>
              <div className="w-16" /> {/* spacer */}
            </>
          )}
        </div>
      </header>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {page === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardPage
              tasks={tasks}
              completions={completions}
              onCompletionChange={handleCompletionChange}
              streak={streak}
            />
          </motion.div>
        ) : (
          <motion.div
            key="manage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ManageTasksPage tasks={tasks} onTasksChange={handleTasksChange} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-6 text-center">
        <p className="text-xs text-muted-foreground font-sans">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster position="bottom-right" />
    </div>
  );
}
