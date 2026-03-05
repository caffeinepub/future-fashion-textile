import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { AboutSection } from "./components/AboutSection";
import { AdminPanel } from "./components/AdminPanel";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navigation } from "./components/Navigation";
import { PortfolioSection } from "./components/PortfolioSection";
import { ServicesSection } from "./components/ServicesSection";
import { useActor } from "./hooks/useActor";
import { seedProjectsIfNeeded } from "./utils/seedProjects";

export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  const { actor, isFetching } = useActor();

  // Seed sample projects on first load if none exist
  useEffect(() => {
    if (actor && !isFetching) {
      seedProjectsIfNeeded(actor).catch(() => {});
    }
  }, [actor, isFetching]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation onAdminClick={() => setAdminOpen(true)} />

      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <ContactSection />
      </main>

      <Footer />

      <AnimatePresence>
        {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
      </AnimatePresence>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.995 0.003 80)",
            border: "1px solid oklch(0.86 0.018 75)",
            color: "oklch(0.15 0.02 30)",
            fontFamily: "'Cabinet Grotesk', sans-serif",
            borderRadius: "0",
          },
        }}
      />
    </div>
  );
}
