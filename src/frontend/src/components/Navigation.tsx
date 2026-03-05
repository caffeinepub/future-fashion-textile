import { Button } from "@/components/ui/button";
import { Menu, Settings, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home", ocid: "nav.home.link" },
  { label: "About", href: "#about", ocid: "nav.about.link" },
  { label: "Services", href: "#services", ocid: "nav.services.link" },
  { label: "Portfolio", href: "#portfolio", ocid: "nav.portfolio.link" },
  { label: "Contact", href: "#contact", ocid: "nav.contact.link" },
];

interface NavigationProps {
  onAdminClick: () => void;
}

export function Navigation({ onAdminClick }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? "glass-warm shadow-card py-3 border-b border-border"
            : "py-5 bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNavClick("#home")}
            className="flex flex-col items-start leading-none"
          >
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Future Fashion
            </span>
            <span className="font-cabinet text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
              Textile Studio
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                data-ocid={link.ocid}
                onClick={() => handleNavClick(link.href)}
                className="font-cabinet text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-burgundy group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Admin CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              data-ocid="nav.admin.link"
              variant="outline"
              size="sm"
              onClick={onAdminClick}
              className="border-border text-foreground/70 hover:border-burgundy hover:text-burgundy font-cabinet text-xs uppercase tracking-widest rounded-none"
            >
              <Settings size={13} className="mr-1.5" />
              Admin
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground/70 hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-[60px] left-0 right-0 z-40 glass-warm border-b border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  data-ocid={link.ocid}
                  onClick={() => handleNavClick(link.href)}
                  className="font-cabinet text-base font-medium text-foreground text-left hover:text-burgundy transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                data-ocid="nav.admin.link"
                variant="outline"
                size="sm"
                onClick={() => {
                  setMobileOpen(false);
                  onAdminClick();
                }}
                className="w-fit border-border hover:border-burgundy hover:text-burgundy font-cabinet text-xs uppercase tracking-widest rounded-none"
              >
                <Settings size={13} className="mr-1.5" />
                Admin Panel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
