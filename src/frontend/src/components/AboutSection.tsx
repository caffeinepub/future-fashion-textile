import { CheckCircle2, Scissors } from "lucide-react";
import { motion } from "motion/react";

const expertise = [
  "Repeat Pattern Construction",
  "Digital Surface Design",
  "Colorway Development",
  "CAD Textile Design",
  "Woven & Printed Fabrics",
  "Fashion Illustration",
  "Adobe Illustrator & Photoshop",
  "Hand-painted Artwork",
];

export function AboutSection() {
  return (
    <section id="about" className="section-pad bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative w-full max-w-md mx-auto">
              {/* Main image frame */}
              <div
                className="aspect-[3/4] rounded-none overflow-hidden"
                style={{
                  border: "1px solid oklch(0.86 0.018 75)",
                  boxShadow: "8px 8px 0 oklch(0.38 0.13 15 / 0.08)",
                }}
              >
                <img
                  src="/assets/generated/textile-patterns-hero.dim_800x600.jpg"
                  alt="Future Fashion Textile Studio"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative corners */}
              <div className="absolute -top-3 -left-3 w-10 h-10 border-l-2 border-t-2 border-gold" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 border-r-2 border-b-2 border-burgundy" />

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-8 -right-8 bg-card border border-border shadow-card p-4 hidden lg:block"
                style={{ boxShadow: "4px 4px 0 oklch(0.72 0.13 72 / 0.15)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(0.38 0.13 15 / 0.1)" }}
                  >
                    <Scissors size={18} className="text-burgundy" />
                  </div>
                  <div>
                    <div className="font-display text-xl font-bold text-gradient-gold">
                      7+ Years
                    </div>
                    <div className="text-xs font-cabinet text-muted-foreground uppercase tracking-wider">
                      of Experience
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            {/* Section tag */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[2px] bg-gold" />
              <span className="font-cabinet text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                About the Studio
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Where Craft Meets{" "}
              <span className="text-gradient-gold italic font-serif font-normal">
                Contemporary
              </span>{" "}
              Design
            </h2>

            <div className="space-y-4 text-muted-foreground font-sans text-base leading-relaxed mb-8">
              <p>
                Future Fashion Textile is a Lahore-based print pattern design
                studio founded with a passion for transforming creative ideas
                into exceptional textile artwork. We specialize in bespoke print
                patterns for fashion brands, garment manufacturers, and
                lifestyle labels.
              </p>
              <p>
                Our expertise spans digital surface design, hand-crafted
                artwork, and colorway development — delivering repeat-ready
                patterns that move seamlessly from concept to production. We
                understand the language of fabric and the demands of the fashion
                supply chain.
              </p>
              <p>
                Every pattern is thoughtfully designed to balance visual
                storytelling with technical precision — because beautiful design
                must also work beautifully.
              </p>
            </div>

            {/* Expertise */}
            <div className="mb-8">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                Our Expertise
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {expertise.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-2.5 text-sm text-foreground/80 font-sans"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-gold flex-shrink-0"
                    />
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() =>
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 text-sm font-cabinet font-semibold uppercase tracking-widest text-burgundy hover:text-burgundy/70 transition-colors border-b-2 border-burgundy/30 hover:border-burgundy pb-1"
            >
              Start a Project →
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
