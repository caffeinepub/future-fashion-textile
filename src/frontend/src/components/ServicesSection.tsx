import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { Service } from "../backend.d";
import { useActor } from "../hooks/useActor";

const fallbackServices = [
  {
    id: "1",
    title: "Custom Print Patterns",
    description:
      "Fully bespoke print designs tailored to your brand's DNA. We create original repeat patterns, placement prints, and engineered designs — from initial concept sketches to final digital artwork ready for production.",
    price: null as bigint | null,
    icon: "✦",
    accentClass: "bg-burgundy/8 border-burgundy/15",
    tagClass: "bg-burgundy/8 text-burgundy border-burgundy/15",
    tags: ["All-over prints", "Placement prints", "Engineered prints"],
  },
  {
    id: "2",
    title: "Fabric Design",
    description:
      "Surface design for wovens, knits, and printed textiles. We develop fabric aesthetics that translate beautifully across different substrates — silk, cotton, rayon, and synthetic blends — with color accuracy guaranteed.",
    price: null as bigint | null,
    icon: "◆",
    accentClass: "bg-gold/8 border-gold/20",
    tagClass: "bg-gold/8 text-[oklch(0.55_0.12_68)] border-gold/20",
    tags: ["Woven fabrics", "Printed textiles", "Technical specs"],
  },
  {
    id: "3",
    title: "Repeat Pattern Design",
    description:
      "Precision-constructed tile and repeat patterns for seamless, production-ready artwork. Block, half-drop, mirror, and engineered repeats delivered in all standard industry formats.",
    price: null as bigint | null,
    icon: "▲",
    accentClass: "bg-terracotta/8 border-terracotta/15",
    tagClass: "bg-terracotta/8 text-terracotta border-terracotta/15",
    tags: ["Half-drop repeat", "Block repeat", "Tossed repeat"],
  },
  {
    id: "4",
    title: "Color Variations & Colorways",
    description:
      "Comprehensive colorway development to maximize the commercial potential of your designs. We develop harmonious palettes aligned with seasonal trend forecasts and your brand's color story.",
    price: null as bigint | null,
    icon: "●",
    accentClass: "bg-chart-4/8 border-chart-4/15",
    tagClass: "bg-chart-4/8 text-chart-4 border-chart-4/15",
    tags: ["Seasonal palettes", "Trend alignment", "Multiple colorways"],
  },
];

function ServiceCard({
  title,
  description,
  price,
  icon,
  accentClass,
  tagClass,
  tags,
  index,
}: {
  title: string;
  description: string;
  price: bigint | null;
  icon: string;
  accentClass: string;
  tagClass: string;
  tags: string[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group rounded-none border ${accentClass} bg-card p-7 hover-lift transition-colors duration-300 overflow-hidden`}
    >
      {/* Decorative corner */}
      <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-border/40 opacity-50" />

      {/* Icon */}
      <div
        className="w-12 h-12 flex items-center justify-center mb-5 text-2xl font-display font-bold"
        style={{ color: "oklch(0.38 0.13 15)" }}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-display text-xl font-bold text-foreground mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed font-sans mb-5">
        {description}
      </p>

      {/* Price if available */}
      {price !== null && Number(price) > 0 && (
        <div className="mb-4">
          <span className="font-cabinet text-xs uppercase tracking-wider text-muted-foreground">
            Starting from{" "}
          </span>
          <span className="font-display text-lg font-bold text-burgundy">
            PKR {Number(price).toLocaleString()}
          </span>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`text-xs px-2.5 py-1 border font-cabinet ${tagClass}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export function ServicesSection() {
  const { actor, isFetching } = useActor();
  const { data: backendServices, isLoading } = useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listServices();
    },
    enabled: !!actor && !isFetching,
  });

  // Use backend services if available, else use fallback
  const hasBackendServices = backendServices && backendServices.length > 0;

  return (
    <section
      id="services"
      className="section-pad"
      style={{ background: "oklch(0.97 0.008 80)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-gold" />
            <span className="font-cabinet text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              What We Offer
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Design <span className="text-gradient-burgundy">Services</span>
            </h2>
            <p className="text-muted-foreground font-sans text-base leading-relaxed md:max-w-sm">
              End-to-end textile print design solutions — from concept
              development to production-ready artwork delivery.
            </p>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-burgundy" size={28} />
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {hasBackendServices
              ? backendServices.map((service, i) => (
                  <ServiceCard
                    key={service.id.toString()}
                    title={service.title}
                    description={service.description}
                    price={service.price}
                    icon={fallbackServices[i % fallbackServices.length].icon}
                    accentClass={
                      fallbackServices[i % fallbackServices.length].accentClass
                    }
                    tagClass={
                      fallbackServices[i % fallbackServices.length].tagClass
                    }
                    tags={[]}
                    index={i}
                  />
                ))
              : fallbackServices.map((service, i) => (
                  <ServiceCard
                    key={service.id}
                    title={service.title}
                    description={service.description}
                    price={service.price}
                    icon={service.icon}
                    accentClass={service.accentClass}
                    tagClass={service.tagClass}
                    tags={service.tags}
                    index={i}
                  />
                ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="font-cabinet text-sm text-muted-foreground mb-4">
            Need a custom service package?
          </p>
          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex items-center gap-2 font-cabinet text-sm font-semibold uppercase tracking-widest text-burgundy hover:text-burgundy/70 border-b-2 border-burgundy/30 hover:border-burgundy pb-1 transition-all"
          >
            Discuss Your Requirements →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
