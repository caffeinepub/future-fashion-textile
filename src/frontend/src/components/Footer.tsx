import { Heart, Mail, MapPin } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  return (
    <footer
      className="border-t border-border"
      style={{ background: "oklch(0.15 0.025 15)" }}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand column */}
        <div>
          <div className="mb-4">
            <div className="font-display text-xl font-bold text-white/90 leading-tight">
              Future Fashion Textile
            </div>
            <div className="font-cabinet text-[10px] uppercase tracking-[0.25em] text-gold/70 font-medium mt-0.5">
              Print Pattern Design Studio
            </div>
          </div>
          <p className="text-sm font-sans text-white/50 leading-relaxed max-w-xs">
            Bespoke print pattern design for fashion brands and garment
            manufacturers. Delivering repeat-ready artwork from concept to
            production.
          </p>
        </div>

        {/* Services column */}
        <div>
          <h4 className="font-cabinet text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            Services
          </h4>
          <ul className="space-y-2.5">
            {[
              "Custom Print Patterns",
              "Fabric Design",
              "Repeat Pattern Design",
              "Color Variations & Colorways",
            ].map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .querySelector("#services")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm font-sans text-white/50 hover:text-white/80 transition-colors text-left"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <h4 className="font-cabinet text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
            Get in Touch
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={13} className="text-gold/60 flex-shrink-0" />
              <span className="text-sm font-sans text-white/50">
                hello@futurefashiontextile.com
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={13} className="text-gold/60 flex-shrink-0" />
              <span className="text-sm font-sans text-white/50">
                Lahore, Pakistan
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-6 inline-flex items-center gap-2 font-cabinet text-xs uppercase tracking-widest text-gold/70 hover:text-gold transition-colors border-b border-gold/20 hover:border-gold/50 pb-0.5"
          >
            Start a Project →
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-6 py-5"
        style={{ borderColor: "oklch(0.25 0.03 15)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 font-cabinet">
            © {year} Future Fashion Textile. All rights reserved.
          </p>
          <p className="text-xs text-white/30 font-cabinet flex items-center gap-1.5">
            Built with <Heart size={11} className="text-gold/60 fill-gold/60" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/50 hover:text-gold/80 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
