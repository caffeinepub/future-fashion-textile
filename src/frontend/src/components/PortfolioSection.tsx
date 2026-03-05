import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ProjectCategory } from "../backend.d";
import type { Project } from "../backend.d";
import { useListProjects } from "../hooks/useQueries";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";

const FILTER_OPTIONS = [
  { label: "All Patterns", value: null },
  { label: "Floral Print", value: ProjectCategory.uiUx },
  { label: "Geometric", value: ProjectCategory.branding },
  { label: "Abstract", value: ProjectCategory.graphicDesign },
];

const PLACEHOLDER_PROJECTS: Project[] = [
  {
    id: 1n,
    title: "Rosette Bloom Collection",
    description:
      "Delicate rose and botanical motifs in a half-drop repeat. Designed for lightweight chiffon and crepe fabrics. Available in 6 colorways including dusty pink, sage, and deep burgundy.",
    imageUrl: "/assets/generated/pattern-floral.dim_800x600.jpg",
    category: ProjectCategory.uiUx,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: 2n,
    title: "Terracotta Grid Series",
    description:
      "Bold geometric block prints inspired by traditional Ajrak tile patterns. Features angular motifs in warm earthy tones. Suitable for home textiles, cotton kurtas, and structured wear.",
    imageUrl: "/assets/generated/pattern-geometric.dim_800x600.jpg",
    category: ProjectCategory.branding,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: 3n,
    title: "Watercolor Wash Pattern",
    description:
      "Abstract watercolor brushstroke repeat in soft blush and dusty burgundy. An organic, artisanal aesthetic perfect for summer collections and premium athleisure.",
    imageUrl: "/assets/generated/pattern-abstract.dim_800x600.jpg",
    category: ProjectCategory.graphicDesign,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: 4n,
    title: "Royal Paisley Damask",
    description:
      "Intricate paisley and damask-inspired print drawing from Mughal textile heritage. Rendered in deep burgundy with gold highlights for luxury sarees, dupattas, and bridal fabric.",
    imageUrl: "/assets/generated/pattern-paisley.dim_800x600.jpg",
    category: ProjectCategory.uiUx,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: 5n,
    title: "Ikat Stripe Collection",
    description:
      "Contemporary ikat-inspired stripe patterns in warm rust and cream. Developed for woven fabrics and printed linen, with four coordinating colorways.",
    imageUrl: "/assets/generated/pattern-stripe.dim_800x600.jpg",
    category: ProjectCategory.branding,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
  {
    id: 6n,
    title: "Botanical Leaf Print",
    description:
      "Hand-painted botanical leaf motifs in sage green and terracotta on ivory. Versatile placement and all-over variants designed for premium cotton and organic muslin fabrics.",
    imageUrl: "/assets/generated/pattern-botanical.dim_800x600.jpg",
    category: ProjectCategory.graphicDesign,
    createdAt: BigInt(Date.now() * 1_000_000),
  },
];

export function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | null>(
    null,
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: projects, isLoading } = useListProjects(null);

  // Use real projects if available, else use placeholder
  const displayProjects =
    projects && projects.length > 0 ? projects : PLACEHOLDER_PROJECTS;

  const filtered = activeFilter
    ? displayProjects.filter((p) => p.category === activeFilter)
    : displayProjects;

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <section
      id="portfolio"
      className="section-pad"
      style={{ background: "oklch(0.94 0.01 75)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-gold" />
            <span className="font-cabinet text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              Pattern Collection
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Featured{" "}
              <span className="text-gradient-gold italic font-serif font-normal">
                Patterns
              </span>
            </h2>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed md:max-w-xs">
              A selection of recent print pattern projects spanning florals,
              geometrics, and abstract designs.
            </p>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              data-ocid="portfolio.filter.tab"
              onClick={() => setActiveFilter(opt.value)}
              className={`px-5 py-2 text-sm font-cabinet font-medium transition-all duration-200 rounded-none border ${
                activeFilter === opt.value
                  ? "bg-primary text-primary-foreground border-primary shadow-burgundy"
                  : "bg-transparent text-muted-foreground border-border hover:border-burgundy hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="portfolio.loading_state"
            className="flex items-center justify-center py-20"
          >
            <Loader2 className="text-burgundy animate-spin" size={32} />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div
            data-ocid="portfolio.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-16 h-16 flex items-center justify-center mb-4 text-3xl"
              style={{ border: "1px solid oklch(0.86 0.018 75)" }}
            >
              ◆
            </div>
            <p className="font-display text-xl text-muted-foreground">
              No patterns in this category yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2 font-sans">
              Check back soon or explore other categories.
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div
            data-ocid="portfolio.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((project, index) => (
              <ProjectCard
                key={project.id.toString()}
                project={project}
                index={index}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
