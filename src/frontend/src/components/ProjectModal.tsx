import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Tag } from "lucide-react";
import type { Project } from "../backend.d";
import { ProjectCategory } from "../backend.d";

const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.uiUx]: "Floral Print",
  [ProjectCategory.branding]: "Geometric Design",
  [ProjectCategory.graphicDesign]: "Abstract Pattern",
};

interface ProjectModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  if (!project) return null;

  const date = new Date(Number(project.createdAt / 1_000_000n));
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="project.dialog"
        className="max-w-2xl p-0 overflow-hidden bg-card border-border rounded-none"
        style={{ border: "1px solid oklch(0.86 0.018 75)" }}
      >
        {/* Image */}
        <div className="aspect-video w-full overflow-hidden bg-surface">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-4">
            <div className="mb-3">
              <DialogTitle className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight">
                {project.title}
              </DialogTitle>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-cabinet">
                <Tag size={12} className="text-burgundy" />
                <span>
                  {categoryLabels[project.category] ?? String(project.category)}
                </span>
              </div>
              <div className="w-px h-3 bg-border" />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-cabinet">
                <Calendar size={12} className="text-gold" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </DialogHeader>

          <DialogDescription className="text-base text-muted-foreground leading-relaxed font-sans">
            {project.description}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
