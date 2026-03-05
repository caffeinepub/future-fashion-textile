import { Eye } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "../backend.d";
import { ProjectCategory } from "../backend.d";

const categoryLabels: Record<ProjectCategory, string> = {
  [ProjectCategory.uiUx]: "Floral Print",
  [ProjectCategory.branding]: "Geometric Design",
  [ProjectCategory.graphicDesign]: "Abstract Pattern",
};

const categoryStyles: Record<ProjectCategory, string> = {
  [ProjectCategory.uiUx]: "bg-burgundy/10 text-burgundy border-burgundy/20",
  [ProjectCategory.branding]:
    "bg-gold/10 text-[oklch(0.50_0.12_68)] border-gold/20",
  [ProjectCategory.graphicDesign]:
    "bg-terracotta/10 text-terracotta border-terracotta/20",
};

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: (project: Project) => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const ocidIndex = index + 1;

  return (
    <motion.article
      data-ocid={`portfolio.item.${ocidIndex}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => onClick(project)}
      className="group cursor-pointer overflow-hidden bg-card hover-lift transition-all duration-300"
      style={{
        border: "1px solid oklch(0.86 0.018 75)",
        boxShadow: "0 2px 16px oklch(0.38 0.13 15 / 0.06)",
      }}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative bg-surface">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-400 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-card/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <Eye size={18} className="text-burgundy" />
          </div>
        </div>
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-cabinet font-medium border backdrop-blur-sm rounded-none ${
              categoryStyles[project.category] ??
              "bg-muted text-muted-foreground border-border"
            }`}
          >
            {categoryLabels[project.category] ?? String(project.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 border-t border-border">
        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-burgundy transition-colors duration-200 mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-sans">
          {project.description}
        </p>
      </div>
    </motion.article>
  );
}
