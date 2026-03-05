import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Loader2, Mail, MapPin, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitContact } from "../hooks/useQueries";

export function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await submitMutation.mutateAsync({ name, email, message });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="section-pad"
      style={{ background: "oklch(0.97 0.008 80)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-[2px] bg-gold" />
              <span className="font-cabinet text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                Contact Us
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Let's{" "}
              <span className="text-gradient-burgundy italic font-serif font-normal">
                Create
              </span>{" "}
              Together
            </h2>
            <p className="text-muted-foreground font-sans text-base leading-relaxed mb-10 max-w-md">
              Ready to bring your print pattern vision to life? Share your
              project brief and we'll get back to you with a tailored proposal
              within 24 hours.
            </p>

            {/* Contact info */}
            <div className="space-y-5">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@futurefashiontextile.com",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Lahore, Pakistan",
                },
                {
                  icon: Clock,
                  label: "Response Time",
                  value: "Within 24 hours",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "oklch(0.38 0.13 15 / 0.06)",
                        border: "1px solid oklch(0.38 0.13 15 / 0.12)",
                      }}
                    >
                      <Icon size={16} className="text-burgundy" />
                    </div>
                    <div>
                      <div className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="text-sm font-sans text-foreground mt-0.5">
                        {item.value}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decorative pattern strip */}
            <div className="mt-12 hidden lg:block">
              <div
                className="h-24 rounded-none overflow-hidden opacity-40"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, oklch(0.38 0.13 15 / 0.06), oklch(0.38 0.13 15 / 0.06) 2px, transparent 2px, transparent 20px), repeating-linear-gradient(-45deg, oklch(0.72 0.13 72 / 0.06), oklch(0.72 0.13 72 / 0.06) 2px, transparent 2px, transparent 20px)",
                  border: "1px solid oklch(0.86 0.018 75)",
                }}
              />
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-card p-7 md:p-8"
            style={{
              border: "1px solid oklch(0.86 0.018 75)",
              boxShadow: "4px 4px 0 oklch(0.38 0.13 15 / 0.06)",
            }}
          >
            {submitted ? (
              <div
                data-ocid="contact.success_state"
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle
                    size={52}
                    className="text-burgundy mb-4 mx-auto"
                  />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground font-sans mb-6">
                  Thank you for reaching out. We'll get back to you with a
                  proposal within 24 hours.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="border-border hover:border-burgundy hover:text-burgundy font-cabinet text-sm rounded-none"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <>
                {submitMutation.isError && (
                  <div
                    data-ocid="contact.error_state"
                    className="mb-5 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-sans rounded-none"
                  >
                    Failed to send. Please try again.
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label
                      htmlFor="contact-name"
                      className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-2 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="contact-name"
                      data-ocid="contact.name.input"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      className="bg-background border-border focus-visible:ring-burgundy/30 focus-visible:border-burgundy font-sans rounded-none"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="contact-email"
                      className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-2 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="contact-email"
                      data-ocid="contact.email.input"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="bg-background border-border focus-visible:ring-burgundy/30 focus-visible:border-burgundy font-sans rounded-none"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="contact-message"
                      className="text-xs font-cabinet uppercase tracking-wider text-muted-foreground mb-2 block"
                    >
                      Project Brief
                    </Label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.message.textarea"
                      placeholder="Tell us about your project — fabric type, quantity, style references, timeline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="bg-background border-border focus-visible:ring-burgundy/30 focus-visible:border-burgundy font-sans resize-none rounded-none"
                    />
                  </div>

                  {submitMutation.isPending && (
                    <div
                      data-ocid="contact.loading_state"
                      className="sr-only"
                      aria-live="polite"
                    >
                      Sending your message...
                    </div>
                  )}

                  <Button
                    type="submit"
                    data-ocid="contact.submit_button"
                    disabled={submitMutation.isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet uppercase tracking-widest text-sm py-6 shadow-burgundy rounded-none"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
