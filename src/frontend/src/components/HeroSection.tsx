import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

const marqueeItems = [
  { label: "Print Pattern Design", id: "ppd" },
  { label: "Fabric Prints", id: "fp" },
  { label: "Repeat Patterns", id: "rp" },
  { label: "Color Variation", id: "cv" },
  { label: "Custom Textiles", id: "ct" },
  { label: "Fashion Prints", id: "fap" },
  { label: "Surface Design", id: "sd" },
  { label: "Pattern Collections", id: "pc" },
];

export function HeroSection() {
  const handleViewPortfolio = () => {
    const el = document.querySelector("#portfolio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "oklch(0.97 0.008 80)" }}
    >
      {/* Decorative pattern background */}
      <div className="absolute inset-0 pattern-grid opacity-60 pointer-events-none" />

      {/* Diagonal accent */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 40%, oklch(0.94 0.01 75) 40%)",
        }}
      />

      {/* Gold accent lines */}
      <div className="absolute top-0 right-[50%] w-px h-full bg-border pointer-events-none opacity-60" />

      {/* Hero image — right half */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{
          clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
        }}
      >
        <img
          src="/assets/generated/textile-hero.dim_1920x1080.jpg"
          alt="Future Fashion Textile — Print Pattern Design"
          className="w-full h-full object-cover opacity-60"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, oklch(0.97 0.008 80) 0%, oklch(0.97 0.008 80 / 0.3) 30%, transparent 70%)",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 py-32 md:py-40">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-[2px] bg-gold" />
              <span className="font-cabinet text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Lahore, Pakistan · Est. 2018
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.0] tracking-tight mb-8 text-foreground"
            >
              <span className="block">Print</span>
              <span className="block text-gradient-burgundy">Pattern</span>
              <span className="block">Design</span>
              <span className="block font-serif font-normal italic text-4xl sm:text-5xl md:text-6xl text-gold/80 mt-2">
                by Future Fashion
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="text-lg text-muted-foreground max-w-lg mb-10 font-sans leading-relaxed"
            >
              Bespoke print patterns and textile designs crafted for fashion
              houses, garment manufacturers, and independent designers. From
              concept to repeat-ready artwork.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                data-ocid="hero.primary_button"
                size="lg"
                onClick={handleViewPortfolio}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet uppercase tracking-widest text-sm px-8 py-6 shadow-burgundy rounded-none hover:shadow-lg transition-all duration-300 group"
              >
                View Portfolio
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleContact}
                className="border-foreground/30 text-foreground hover:border-burgundy hover:text-burgundy font-cabinet uppercase tracking-widest text-sm px-8 py-6 rounded-none transition-all duration-300"
              >
                Get a Quote
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-14 flex gap-10"
            >
              {[
                { value: "200+", label: "Patterns Created" },
                { value: "85+", label: "Clients Served" },
                { value: "7+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="font-display text-3xl font-bold text-gradient-burgundy">
                    {stat.value}
                  </div>
                  <div className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="relative z-10 border-t border-b border-border bg-primary overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3">
          {[
            ...marqueeItems.map((m) => ({ ...m, id: `a-${m.id}` })),
            ...marqueeItems.map((m) => ({ ...m, id: `b-${m.id}` })),
            ...marqueeItems.map((m) => ({ ...m, id: `c-${m.id}` })),
          ].map((item) => (
            <span
              key={item.id}
              className="font-cabinet text-xs uppercase tracking-[0.2em] text-primary-foreground/90 px-8 flex items-center gap-8"
            >
              {item.label}
              <Sparkles size={10} className="text-gold opacity-60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
