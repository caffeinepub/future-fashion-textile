import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutGrid,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProjectCategory } from "../backend.d";
import type { Project, Service } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateProject,
  useDeleteProject,
  useGetAllContacts,
  useIsAdmin,
  useListProjects,
  useUpdateProject,
} from "../hooks/useQueries";

const categoryOptions = [
  { value: ProjectCategory.uiUx, label: "Floral Print" },
  { value: ProjectCategory.branding, label: "Geometric Design" },
  { value: ProjectCategory.graphicDesign, label: "Abstract Pattern" },
];

interface ProjectFormData {
  title: string;
  description: string;
  category: ProjectCategory;
  imageUrl: string;
}

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
}

const emptyProjectForm: ProjectFormData = {
  title: "",
  description: "",
  category: ProjectCategory.uiUx,
  imageUrl: "",
};

const emptyServiceForm: ServiceFormData = {
  title: "",
  description: "",
  price: "",
};

interface AdminPanelProps {
  onClose: () => void;
}

function useListServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listServices();
    },
    enabled: !!actor && !isFetching,
  });
}

function useAddService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      price: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addService(data.title, data.description, data.price);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

function useUpdateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      serviceId: bigint;
      title: string;
      description: string;
      price: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateService(
        data.serviceId,
        data.title,
        data.description,
        data.price,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

function useDeleteService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteService(serviceId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });
}

function useMarkContactRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.markContactAsRead(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["contacts"] }),
  });
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const isLoggedIn = !!identity;

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: projects, isLoading: projectsLoading } = useListProjects(null);
  const { data: contacts, isLoading: contactsLoading } = useGetAllContacts();
  const { data: services, isLoading: servicesLoading } = useListServices();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const addService = useAddService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const markRead = useMarkContactRead();

  const [activeTab, setActiveTab] = useState("projects");
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] =
    useState<ProjectFormData>(emptyProjectForm);
  const [deleteProjectId, setDeleteProjectId] = useState<bigint | null>(null);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] =
    useState<ServiceFormData>(emptyServiceForm);
  const [deleteServiceId, setDeleteServiceId] = useState<bigint | null>(null);

  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (editingProject) {
      setProjectForm({
        title: editingProject.title,
        description: editingProject.description,
        category: editingProject.category,
        imageUrl: editingProject.imageUrl,
      });
    } else {
      setProjectForm(emptyProjectForm);
    }
  }, [editingProject]);

  useEffect(() => {
    if (editingService) {
      setServiceForm({
        title: editingService.title,
        description: editingService.description,
        price: editingService.price.toString(),
      });
    } else {
      setServiceForm(emptyServiceForm);
    }
  }, [editingService]);

  const handleSaveProject = async () => {
    if (
      !projectForm.title.trim() ||
      !projectForm.description.trim() ||
      !projectForm.imageUrl.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          projectId: editingProject.id,
          ...projectForm,
        });
        toast.success("Project updated.");
        setEditingProject(null);
      } else {
        await createProject.mutateAsync(projectForm);
        toast.success("Project added.");
        setShowProjectForm(false);
        setProjectForm(emptyProjectForm);
      }
    } catch {
      toast.error("Failed to save project.");
    }
  };

  const handleDeleteProject = async (id: bigint) => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Project deleted.");
      setDeleteProjectId(null);
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  const handleSaveService = async () => {
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      toast.error("Please fill in title and description.");
      return;
    }
    const price = BigInt(
      serviceForm.price ? Number.parseInt(serviceForm.price, 10) || 0 : 0,
    );
    try {
      if (editingService) {
        await updateService.mutateAsync({
          serviceId: editingService.id,
          title: serviceForm.title,
          description: serviceForm.description,
          price,
        });
        toast.success("Service updated.");
        setEditingService(null);
      } else {
        await addService.mutateAsync({
          title: serviceForm.title,
          description: serviceForm.description,
          price,
        });
        toast.success("Service added.");
        setShowServiceForm(false);
        setServiceForm(emptyServiceForm);
      }
    } catch {
      toast.error("Failed to save service.");
    }
  };

  const handleDeleteService = async (id: bigint) => {
    try {
      await deleteService.mutateAsync(id);
      toast.success("Service deleted.");
      setDeleteServiceId(null);
    } catch {
      toast.error("Failed to delete service.");
    }
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-stretch md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close admin panel"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full md:max-w-4xl max-h-screen md:max-h-[90vh] flex flex-col bg-card border border-border rounded-none overflow-hidden shadow-card"
        style={{
          border: "1px solid oklch(0.86 0.018 75)",
          boxShadow: "0 24px 64px oklch(0.38 0.13 15 / 0.2)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b border-border"
          style={{ background: "oklch(0.15 0.025 15)" }}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-gold/80" />
            <div>
              <h2 className="font-display text-lg font-bold text-white">
                Admin Panel
              </h2>
              <p className="text-xs text-white/50 font-cabinet mt-0.5">
                {isLoggedIn
                  ? isAdmin
                    ? "Logged in as Admin"
                    : "Checking permissions..."
                  : "Authentication required"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-none hover:bg-white/10 transition-colors"
            aria-label="Close admin panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isInitializing || isAdminLoading ? (
            <div
              data-ocid="admin.loading_state"
              className="flex items-center justify-center py-16"
            >
              <Loader2 className="animate-spin text-burgundy" size={28} />
            </div>
          ) : !isLoggedIn ? (
            /* Login Screen */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div
                className="w-16 h-16 flex items-center justify-center mb-6"
                style={{
                  background: "oklch(0.38 0.13 15 / 0.08)",
                  border: "1px solid oklch(0.38 0.13 15 / 0.15)",
                }}
              >
                <LogIn size={28} className="text-burgundy" />
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Admin Login
              </h3>
              <p className="text-muted-foreground font-sans text-sm mb-8 max-w-sm">
                Sign in with Internet Identity to access the admin dashboard and
                manage your textile portfolio.
              </p>
              <Button
                data-ocid="admin.login_button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet uppercase tracking-widest text-sm px-8 py-5 shadow-burgundy rounded-none"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </div>
          ) : !isAdmin ? (
            /* Not admin */
            <div
              data-ocid="admin.error_state"
              className="flex flex-col items-center justify-center py-16 px-6 text-center"
            >
              <div
                className="w-16 h-16 flex items-center justify-center mb-6"
                style={{
                  background: "oklch(0.577 0.245 27 / 0.08)",
                  border: "1px solid oklch(0.577 0.245 27 / 0.2)",
                }}
              >
                <X size={28} className="text-destructive" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Access Denied
              </h3>
              <p className="text-muted-foreground font-sans text-sm mb-6">
                Your account does not have admin privileges.
              </p>
              <Button
                variant="outline"
                onClick={clear}
                className="border-border hover:border-destructive hover:text-destructive font-cabinet text-sm rounded-none"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            /* Admin Dashboard */
            <div className="p-6">
              {/* Top bar */}
              <div className="flex items-center justify-end mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="text-muted-foreground hover:text-destructive font-cabinet text-xs uppercase tracking-wider rounded-none"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign Out
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList
                  className="mb-6 rounded-none"
                  style={{
                    background: "oklch(0.94 0.01 75)",
                    border: "1px solid oklch(0.86 0.018 75)",
                  }}
                >
                  <TabsTrigger
                    value="projects"
                    data-ocid="admin.projects.tab"
                    className="font-cabinet text-xs uppercase tracking-wider rounded-none"
                  >
                    <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="messages"
                    data-ocid="admin.messages.tab"
                    className="font-cabinet text-xs uppercase tracking-wider rounded-none"
                  >
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    Messages
                    {contacts &&
                      contacts.filter((c) => !c.isRead).length > 0 && (
                        <span
                          className="ml-1.5 text-xs px-1.5 py-0.5 font-cabinet"
                          style={{
                            background: "oklch(0.38 0.13 15 / 0.12)",
                            color: "oklch(0.38 0.13 15)",
                          }}
                        >
                          {contacts.filter((c) => !c.isRead).length}
                        </span>
                      )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="services"
                    data-ocid="admin.services.tab"
                    className="font-cabinet text-xs uppercase tracking-wider rounded-none"
                  >
                    <Settings className="mr-1.5 h-3.5 w-3.5" />
                    Services
                  </TabsTrigger>
                </TabsList>

                {/* ─── Projects Tab ─── */}
                <TabsContent value="projects">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      All Projects ({projects?.length ?? 0})
                    </h3>
                    <Button
                      data-ocid="admin.project.add_button"
                      size="sm"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm(emptyProjectForm);
                        setShowProjectForm(true);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet text-xs uppercase tracking-wider shadow-burgundy rounded-none"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Project
                    </Button>
                  </div>

                  {projectsLoading ? (
                    <div
                      data-ocid="admin.projects.loading_state"
                      className="flex justify-center py-10"
                    >
                      <Loader2
                        className="animate-spin text-burgundy"
                        size={24}
                      />
                    </div>
                  ) : !projects || projects.length === 0 ? (
                    <div
                      data-ocid="admin.projects.empty_state"
                      className="text-center py-12 text-muted-foreground"
                      style={{
                        border: "1px dashed oklch(0.86 0.018 75)",
                      }}
                    >
                      <LayoutGrid
                        size={32}
                        className="mx-auto mb-3 opacity-30"
                      />
                      <p className="font-sans text-sm">
                        No projects yet. Add your first pattern.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.map((project, index) => {
                        const ocidIndex = index + 1;
                        return (
                          <div
                            key={project.id.toString()}
                            data-ocid={`admin.project.item.${ocidIndex}`}
                            className="flex items-center gap-4 p-4 border border-border bg-surface hover:border-burgundy/30 transition-colors"
                          >
                            <div className="w-14 h-14 overflow-hidden flex-shrink-0 bg-surface-raised">
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-display font-semibold text-sm text-foreground truncate">
                                {project.title}
                              </div>
                              <div className="text-xs text-muted-foreground font-cabinet mt-0.5">
                                {categoryOptions.find(
                                  (c) => c.value === project.category,
                                )?.label ?? project.category}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                data-ocid={`admin.project.edit_button.${ocidIndex}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProject(project);
                                  setShowProjectForm(false);
                                }}
                                className="text-muted-foreground hover:text-burgundy h-8 w-8 p-0 rounded-none"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                data-ocid={`admin.project.delete_button.${ocidIndex}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteProjectId(project.id)}
                                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 rounded-none"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add/Edit Project Form */}
                  <AnimatePresence>
                    {(showProjectForm || editingProject) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        data-ocid="admin.project.dialog"
                        className="overflow-hidden mt-5"
                      >
                        <div
                          className="border border-border bg-surface p-5"
                          style={{ background: "oklch(0.95 0.009 75)" }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display font-semibold text-foreground">
                              {editingProject
                                ? "Edit Project"
                                : "Add New Project"}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setShowProjectForm(false);
                                setEditingProject(null);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Title
                              </Label>
                              <Input
                                data-ocid="admin.project.title.input"
                                placeholder="Pattern title"
                                value={projectForm.title}
                                onChange={(e) =>
                                  setProjectForm((p) => ({
                                    ...p,
                                    title: e.target.value,
                                  }))
                                }
                                className="bg-card border-border focus-visible:border-burgundy focus-visible:ring-burgundy/20 font-sans text-sm rounded-none"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Description
                              </Label>
                              <Textarea
                                data-ocid="admin.project.description.textarea"
                                placeholder="Pattern description..."
                                value={projectForm.description}
                                onChange={(e) =>
                                  setProjectForm((p) => ({
                                    ...p,
                                    description: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="bg-card border-border focus-visible:border-burgundy focus-visible:ring-burgundy/20 font-sans text-sm resize-none rounded-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                  Category
                                </Label>
                                <Select
                                  value={projectForm.category}
                                  onValueChange={(v) =>
                                    setProjectForm((p) => ({
                                      ...p,
                                      category: v as ProjectCategory,
                                    }))
                                  }
                                >
                                  <SelectTrigger
                                    data-ocid="admin.project.category.select"
                                    className="bg-card border-border font-cabinet text-sm rounded-none"
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {categoryOptions.map((opt) => (
                                      <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                        className="font-cabinet text-sm"
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                  Image URL
                                </Label>
                                <Input
                                  data-ocid="admin.project.imageurl.input"
                                  placeholder="https://..."
                                  value={projectForm.imageUrl}
                                  onChange={(e) =>
                                    setProjectForm((p) => ({
                                      ...p,
                                      imageUrl: e.target.value,
                                    }))
                                  }
                                  className="bg-card border-border focus-visible:border-burgundy focus-visible:ring-burgundy/20 font-sans text-sm rounded-none"
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 pt-1">
                              <Button
                                data-ocid="admin.project.save_button"
                                onClick={handleSaveProject}
                                disabled={
                                  createProject.isPending ||
                                  updateProject.isPending
                                }
                                className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet text-xs uppercase tracking-wider shadow-burgundy rounded-none"
                              >
                                {(createProject.isPending ||
                                  updateProject.isPending) && (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                )}
                                {editingProject
                                  ? "Update Project"
                                  : "Save Project"}
                              </Button>
                              <Button
                                data-ocid="admin.project.cancel_button"
                                variant="outline"
                                onClick={() => {
                                  setShowProjectForm(false);
                                  setEditingProject(null);
                                }}
                                className="border-border hover:border-destructive hover:text-destructive font-cabinet text-xs uppercase tracking-wider rounded-none"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>

                {/* ─── Messages Tab ─── */}
                <TabsContent value="messages">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-5">
                    Contact Messages ({contacts?.length ?? 0})
                  </h3>

                  {contactsLoading ? (
                    <div
                      data-ocid="admin.contacts.loading_state"
                      className="flex justify-center py-10"
                    >
                      <Loader2
                        className="animate-spin text-burgundy"
                        size={24}
                      />
                    </div>
                  ) : !contacts || contacts.length === 0 ? (
                    <div
                      data-ocid="admin.contacts.empty_state"
                      className="text-center py-12 text-muted-foreground"
                      style={{ border: "1px dashed oklch(0.86 0.018 75)" }}
                    >
                      <Mail size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-sans text-sm">No messages yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contacts.map((contact, index) => {
                        const ocidIndex = index + 1;
                        const date = new Date(
                          Number(contact.timestamp / 1_000_000n),
                        );
                        return (
                          <div
                            key={ocidIndex}
                            data-ocid={`admin.message.item.${ocidIndex}`}
                            className={`border p-4 transition-colors ${
                              contact.isRead
                                ? "border-border bg-surface"
                                : "border-burgundy/20 bg-burgundy/3"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-display font-semibold text-sm text-foreground">
                                  {contact.name}
                                </span>
                                <span className="text-muted-foreground text-xs font-cabinet ml-2">
                                  {contact.email}
                                </span>
                                {!contact.isRead && (
                                  <span
                                    className="ml-2 text-xs px-1.5 py-0.5 font-cabinet uppercase tracking-wider"
                                    style={{
                                      background: "oklch(0.38 0.13 15 / 0.1)",
                                      color: "oklch(0.38 0.13 15)",
                                    }}
                                  >
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-cabinet">
                                  {date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                {!contact.isRead && (
                                  <Button
                                    data-ocid={`admin.message.read_button.${ocidIndex}`}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markRead.mutate(contact.id)}
                                    disabled={markRead.isPending}
                                    className="text-xs font-cabinet text-burgundy hover:text-burgundy/70 h-7 px-2 rounded-none"
                                  >
                                    Mark Read
                                  </Button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                              {contact.message}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* ─── Services Tab ─── */}
                <TabsContent value="services">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Services ({services?.length ?? 0})
                    </h3>
                    <Button
                      data-ocid="admin.service.add_button"
                      size="sm"
                      onClick={() => {
                        setEditingService(null);
                        setServiceForm(emptyServiceForm);
                        setShowServiceForm(true);
                      }}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet text-xs uppercase tracking-wider shadow-burgundy rounded-none"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add Service
                    </Button>
                  </div>

                  {servicesLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2
                        className="animate-spin text-burgundy"
                        size={24}
                      />
                    </div>
                  ) : !services || services.length === 0 ? (
                    <div
                      className="text-center py-12 text-muted-foreground"
                      style={{ border: "1px dashed oklch(0.86 0.018 75)" }}
                    >
                      <Settings size={32} className="mx-auto mb-3 opacity-30" />
                      <p className="font-sans text-sm">
                        No services yet. Add your first service.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {services.map((service, index) => {
                        const ocidIndex = index + 1;
                        return (
                          <div
                            key={service.id.toString()}
                            className="flex items-start gap-4 p-4 border border-border bg-surface hover:border-burgundy/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-display font-semibold text-sm text-foreground">
                                {service.title}
                              </div>
                              <div className="text-xs text-muted-foreground font-sans mt-1 line-clamp-2">
                                {service.description}
                              </div>
                              {Number(service.price) > 0 && (
                                <div className="text-xs font-cabinet text-burgundy mt-1">
                                  PKR {Number(service.price).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Button
                                data-ocid={`admin.service.edit_button.${ocidIndex}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingService(service);
                                  setShowServiceForm(false);
                                }}
                                className="text-muted-foreground hover:text-burgundy h-8 w-8 p-0 rounded-none"
                              >
                                <Pencil size={14} />
                              </Button>
                              <Button
                                data-ocid={`admin.service.delete_button.${ocidIndex}`}
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteServiceId(service.id)}
                                className="text-muted-foreground hover:text-destructive h-8 w-8 p-0 rounded-none"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add/Edit Service Form */}
                  <AnimatePresence>
                    {(showServiceForm || editingService) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-5"
                      >
                        <div
                          className="border border-border p-5"
                          style={{ background: "oklch(0.95 0.009 75)" }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-display font-semibold text-foreground">
                              {editingService
                                ? "Edit Service"
                                : "Add New Service"}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setShowServiceForm(false);
                                setEditingService(null);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X size={16} />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Service Title
                              </Label>
                              <Input
                                placeholder="e.g. Custom Print Patterns"
                                value={serviceForm.title}
                                onChange={(e) =>
                                  setServiceForm((p) => ({
                                    ...p,
                                    title: e.target.value,
                                  }))
                                }
                                className="bg-card border-border focus-visible:border-burgundy focus-visible:ring-burgundy/20 font-sans text-sm rounded-none"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Description
                              </Label>
                              <Textarea
                                placeholder="Service description..."
                                value={serviceForm.description}
                                onChange={(e) =>
                                  setServiceForm((p) => ({
                                    ...p,
                                    description: e.target.value,
                                  }))
                                }
                                rows={3}
                                className="bg-card border-border focus-visible:border-burgundy focus-visible:ring-burgundy/20 font-sans text-sm resize-none rounded-none"
                              />
                            </div>

                            <div>
                              <Label className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-1.5 block">
                                Starting Price (PKR, 0 = on request)
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                value={serviceForm.price}
                                onChange={(e) =>
                                  setServiceForm((p) => ({
                                    ...p,
                                    price: e.target.value,
                                  }))
                                }
                                className="bg-card border-border focus-visible:border-burgundy focus-visible:ring-burgundy/20 font-sans text-sm rounded-none"
                              />
                            </div>

                            <div className="flex gap-3 pt-1">
                              <Button
                                data-ocid="admin.service.save_button"
                                onClick={handleSaveService}
                                disabled={
                                  addService.isPending ||
                                  updateService.isPending
                                }
                                className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet text-xs uppercase tracking-wider shadow-burgundy rounded-none"
                              >
                                {(addService.isPending ||
                                  updateService.isPending) && (
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                )}
                                {editingService
                                  ? "Update Service"
                                  : "Save Service"}
                              </Button>
                              <Button
                                data-ocid="admin.service.cancel_button"
                                variant="outline"
                                onClick={() => {
                                  setShowServiceForm(false);
                                  setEditingService(null);
                                }}
                                className="border-border hover:border-destructive hover:text-destructive font-cabinet text-xs uppercase tracking-wider rounded-none"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </motion.div>

      {/* Delete Project Dialog */}
      <Dialog
        open={deleteProjectId !== null}
        onOpenChange={(v) => !v && setDeleteProjectId(null)}
      >
        <DialogContent
          data-ocid="admin.delete.dialog"
          className="bg-card border-border max-w-sm rounded-none"
          style={{ border: "1px solid oklch(0.86 0.018 75)" }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              Delete Project
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              data-ocid="admin.delete.cancel_button"
              variant="outline"
              onClick={() => setDeleteProjectId(null)}
              className="border-border font-cabinet text-sm rounded-none"
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.delete.confirm_button"
              variant="destructive"
              onClick={() =>
                deleteProjectId && handleDeleteProject(deleteProjectId)
              }
              disabled={deleteProject.isPending}
              className="font-cabinet text-sm rounded-none"
            >
              {deleteProject.isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Dialog */}
      <Dialog
        open={deleteServiceId !== null}
        onOpenChange={(v) => !v && setDeleteServiceId(null)}
      >
        <DialogContent
          className="bg-card border-border max-w-sm rounded-none"
          style={{ border: "1px solid oklch(0.86 0.018 75)" }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-foreground">
              Delete Service
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-sans">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteServiceId(null)}
              className="border-border font-cabinet text-sm rounded-none"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteServiceId && handleDeleteService(deleteServiceId)
              }
              disabled={deleteService.isPending}
              className="font-cabinet text-sm rounded-none"
            >
              {deleteService.isPending ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
