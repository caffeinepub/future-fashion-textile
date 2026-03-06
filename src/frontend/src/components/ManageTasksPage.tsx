import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORY_ORDER,
  type RoutineTask,
  type TaskCategory,
  generateId,
} from "@/utils/routineStorage";
import {
  Check,
  CloudSun,
  Moon,
  Pencil,
  Plus,
  Sun,
  Sunset,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface ManageTasksPageProps {
  tasks: RoutineTask[];
  onTasksChange: (tasks: RoutineTask[]) => void;
}

const CATEGORY_CONFIG: Record<
  TaskCategory,
  {
    badgeBg: string;
    badgeText: string;
    icon: React.ElementType;
    iconColor: string;
  }
> = {
  Morning: {
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    icon: Sun,
    iconColor: "text-amber-500",
  },
  Afternoon: {
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    icon: CloudSun,
    iconColor: "text-sky-500",
  },
  Evening: {
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    icon: Sunset,
    iconColor: "text-violet-500",
  },
  Night: {
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-900",
    icon: Moon,
    iconColor: "text-indigo-600",
  },
};

const emptyForm = {
  title: "",
  description: "",
  category: "Morning" as TaskCategory,
};

export function ManageTasksPage({
  tasks,
  onTasksChange,
}: ManageTasksPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  const sortedTasks = [...tasks].sort((a, b) => a.sortOrder - b.sortOrder);

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newTask: RoutineTask = {
      id: generateId(),
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      category: form.category,
      sortOrder: tasks.length + 1,
      isActive: true,
    };
    onTasksChange([...tasks, newTask]);
    setForm(emptyForm);
    setShowAddForm(false);
    toast.success("Task added successfully");
  }

  function handleDelete(id: string) {
    onTasksChange(tasks.filter((t) => t.id !== id));
    toast.success("Task deleted");
  }

  function handleToggleActive(id: string, value: boolean) {
    onTasksChange(
      tasks.map((t) => (t.id === id ? { ...t, isActive: value } : t)),
    );
  }

  function startEdit(task: RoutineTask) {
    setEditingId(task.id);
    setEditForm({
      title: task.title,
      description: task.description ?? "",
      category: task.category,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  function saveEdit(id: string) {
    if (!editForm.title.trim()) return;
    onTasksChange(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editForm.title.trim(),
              description: editForm.description.trim() || undefined,
              category: editForm.category,
            }
          : t,
      ),
    );
    setEditingId(null);
    toast.success("Task updated");
  }

  const tasksByCategory: Record<TaskCategory, RoutineTask[]> = {
    Morning: [],
    Afternoon: [],
    Evening: [],
    Night: [],
  };
  for (const t of sortedTasks) tasksByCategory[t.category].push(t);

  // Global index for deterministic markers
  let globalIdx = 0;
  const taskIndexMap: Record<string, number> = {};
  for (const cat of CATEGORY_ORDER) {
    for (const t of tasksByCategory[cat]) {
      taskIndexMap[t.id] = ++globalIdx;
    }
  }

  return (
    <main data-ocid="tasks.page" className="max-w-2xl mx-auto px-4 pb-16 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Manage Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tasks.length} tasks total
          </p>
        </div>
        <Button
          data-ocid="add.task.button"
          onClick={() => {
            setShowAddForm((v) => !v);
            setForm(emptyForm);
          }}
          className="gap-2"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </motion.div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <form
              onSubmit={handleAddSubmit}
              className="rounded-2xl border border-border bg-card shadow-card p-5 space-y-4"
            >
              <h2 className="font-cabinet font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                New Task
              </h2>
              <div className="space-y-1.5">
                <Label
                  htmlFor="task-title"
                  className="font-cabinet text-xs font-medium"
                >
                  Task Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  data-ocid="task.input"
                  id="task-title"
                  placeholder="e.g. Morning walk"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                  className="font-sans text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="task-desc"
                  className="font-cabinet text-xs font-medium"
                >
                  Description{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Textarea
                  data-ocid="task.textarea"
                  id="task-desc"
                  placeholder="Brief description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                  className="font-sans text-sm resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="task-category"
                  className="font-cabinet text-xs font-medium"
                >
                  Time of Day
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, category: v as TaskCategory }))
                  }
                >
                  <SelectTrigger
                    data-ocid="task.select"
                    id="task-category"
                    className="font-sans text-sm"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_ORDER.map((cat) => (
                      <SelectItem
                        key={cat}
                        value={cat}
                        className="font-sans text-sm"
                      >
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button
                  data-ocid="add.task.submit_button"
                  type="submit"
                  size="sm"
                  className="flex-1"
                >
                  Add Task
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List by Category */}
      {CATEGORY_ORDER.map((cat, catIdx) => {
        const catTasks = tasksByCategory[cat];
        if (catTasks.length === 0) return null;
        const cfg = CATEGORY_CONFIG[cat];
        const Icon = cfg.icon;

        return (
          <motion.section
            key={cat}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: catIdx * 0.06 }}
            className="mb-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
              <h2 className="font-cabinet font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                {cat}
              </h2>
              <span className="text-xs text-muted-foreground">
                ({catTasks.length})
              </span>
            </div>

            <div className="space-y-2">
              {catTasks.map((task) => {
                const idx = taskIndexMap[task.id] ?? 1;
                const isEditing = editingId === task.id;

                return (
                  <motion.div
                    key={task.id}
                    data-ocid={`task.item.${idx}`}
                    layout
                    className={`rounded-xl border border-border bg-card shadow-xs p-4 transition-all duration-200 ${
                      !task.isActive ? "opacity-50" : ""
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <Input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              title: e.target.value,
                            }))
                          }
                          placeholder="Task title"
                          className="font-sans text-sm"
                          autoFocus
                        />
                        <Textarea
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((f) => ({
                              ...f,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Description (optional)"
                          rows={2}
                          className="font-sans text-sm resize-none"
                        />
                        <Select
                          value={editForm.category}
                          onValueChange={(v) =>
                            setEditForm((f) => ({
                              ...f,
                              category: v as TaskCategory,
                            }))
                          }
                        >
                          <SelectTrigger className="font-sans text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORY_ORDER.map((c) => (
                              <SelectItem
                                key={c}
                                value={c}
                                className="font-sans text-sm"
                              >
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button
                            data-ocid={`task.save_button.${idx}`}
                            size="sm"
                            className="gap-1"
                            onClick={() => saveEdit(task.id)}
                          >
                            <Check className="w-3.5 h-3.5" /> Save
                          </Button>
                          <Button
                            data-ocid={`task.cancel_button.${idx}`}
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={cancelEdit}
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-cabinet font-medium text-sm text-foreground">
                              {task.title}
                            </span>
                            <Badge
                              className={`${cfg.badgeBg} ${cfg.badgeText} border-0 text-xs font-cabinet`}
                            >
                              {cat}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Switch
                            data-ocid={`task.switch.${idx}`}
                            checked={task.isActive}
                            onCheckedChange={(v) =>
                              handleToggleActive(task.id, v)
                            }
                            aria-label={`Toggle ${task.title}`}
                          />
                          <Button
                            data-ocid={`task.edit_button.${idx}`}
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-muted-foreground hover:text-foreground"
                            onClick={() => startEdit(task)}
                            aria-label={`Edit ${task.title}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                data-ocid={`task.delete_button.${idx}`}
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                                aria-label={`Delete ${task.title}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="font-display">
                                  Delete task?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-sans">
                                  Are you sure you want to delete "{task.title}
                                  "? This cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  data-ocid={`task.cancel_button.${idx}`}
                                  className="font-cabinet"
                                >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  data-ocid={`task.confirm_button.${idx}`}
                                  onClick={() => handleDelete(task.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-cabinet"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        );
      })}

      {tasks.length === 0 && (
        <div
          data-ocid="tasks.empty_state"
          className="text-center py-16 text-muted-foreground"
        >
          <p className="font-display text-lg mb-2">No tasks yet</p>
          <p className="text-sm">
            Click "Add Task" to create your first routine task.
          </p>
        </div>
      )}
    </main>
  );
}
