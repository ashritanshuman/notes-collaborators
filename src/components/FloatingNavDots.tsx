import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

export interface NavSection {
  id: string;
  label: string;
}

interface FloatingNavDotsProps {
  sections: NavSection[];
}

export const FloatingNavDots = ({ sections }: FloatingNavDotsProps) => {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);

      // Find the section closest to one third of viewport
      const threshold = window.innerHeight * 0.35;
      let current = sections[0]?.id ?? "";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) current = s.id;
      }
      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const focusIndex = (i: number) => {
    buttonRefs.current[i]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight": {
        e.preventDefault();
        const next = (index + 1) % sections.length;
        focusIndex(next);
        scrollTo(sections[next].id);
        break;
      }
      case "ArrowUp":
      case "ArrowLeft": {
        e.preventDefault();
        const prev = (index - 1 + sections.length) % sections.length;
        focusIndex(prev);
        scrollTo(sections[prev].id);
        break;
      }
      case "Home": {
        e.preventDefault();
        focusIndex(0);
        scrollTo(sections[0].id);
        break;
      }
      case "End": {
        e.preventDefault();
        const last = sections.length - 1;
        focusIndex(last);
        scrollTo(sections[last].id);
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        scrollTo(sections[index].id);
        break;
      }
    }
  };

  return (
    <>
      {/* Desktop: vertical dot rail */}
      <AnimatePresence>
        {visible && (
          <motion.nav
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Section navigation"
          className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-4 p-3 rounded-full glass-intense ring-1 ring-foreground/10"
        >
          {/* Scroll progress track */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-px rounded-full bg-foreground/10 overflow-hidden"
          >
            <motion.div
              className="absolute inset-x-0 top-0 bg-foreground rounded-full origin-top"
              style={{ scaleY: progress, height: "100%" }}
            />
          </div>

          {sections.map((s, i) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                ref={(el) => (buttonRefs.current[i] = el)}
                onClick={() => scrollTo(s.id)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                tabIndex={isActive ? 0 : -1}
                type="button"
                className="group relative z-10 flex items-center justify-center rounded-full p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Jump to ${s.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <motion.span
                  aria-hidden="true"
                  animate={{
                    scale: isActive ? 1.4 : 1,
                    backgroundColor: isActive
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground) / 0.5)",
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="block w-2.5 h-2.5 rounded-full ring-2 ring-background"
                />
                {isActive && (
                  <motion.span
                    aria-hidden="true"
                    layoutId="nav-dot-ring"
                    className="absolute inset-0 -m-1.5 rounded-full ring-2 ring-foreground/40"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                {/* Tooltip */}
                <span className="pointer-events-none absolute right-7 px-3 py-1 rounded-full glass text-xs font-medium text-foreground whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-200">
                  {s.label}
                </span>
              </button>
            );
          })}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile: collapsible toggle */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3"
          >
            <AnimatePresence>
              {mobileOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  role="menu"
                  aria-label="Jump to section"
                  className="flex flex-col gap-1 p-2 rounded-2xl glass-intense ring-1 ring-foreground/10 min-w-[180px]"
                >
                  {sections.map((s) => {
                    const isActive = active === s.id;
                    return (
                      <li key={s.id} role="none">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => scrollTo(s.id)}
                          aria-current={isActive ? "true" : undefined}
                          className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                            isActive
                              ? "bg-foreground text-background"
                              : "text-foreground hover:bg-foreground/10"
                          }`}
                        >
                          {s.label}
                        </button>
                      </li>
                    );
                  })}
                </motion.ul>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close section navigation" : "Open section navigation"}
              className="relative flex items-center justify-center w-12 h-12 rounded-full glass-intense ring-1 ring-foreground/10 text-foreground shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <motion.span
                key={mobileOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};