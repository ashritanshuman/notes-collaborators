import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const ROTATING_PLACEHOLDERS = [
  "Search Data Structures...",
  "Find Machine Learning notes...",
  "Discover Digital Electronics...",
  "Look up Operating Systems...",
  "Explore Computer Networks...",
];

export const AnimatedSearchBar = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Rotate placeholders while idle
  useEffect(() => {
    if (!open || value) return;
    const t = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % ROTATING_PLACEHOLDERS.length);
    }, 2400);
    return () => clearInterval(t);
  }, [open, value]);

  // Focus on open, close on Escape
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 220);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    navigate(`/browse?q=${encodeURIComponent(value.trim())}`);
    setOpen(false);
    setValue("");
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {!open ? (
          <motion.button
            key="trigger"
            type="button"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full glass hover:scale-110 transition-smooth"
            aria-label="Open search"
          >
            <Search className="h-5 w-5 text-foreground" />
          </motion.button>
        ) : (
          <motion.form
            key="search"
            onSubmit={handleSubmit}
            initial={{ width: 40, opacity: 0, filter: "blur(8px)" }}
            animate={{ width: 280, opacity: 1, filter: "blur(0px)" }}
            exit={{ width: 40, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-10 glass-intense rounded-full overflow-hidden flex items-center pl-4 pr-2 ring-1 ring-foreground/10"
          >
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="relative flex-1 mx-2 h-full">
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="absolute inset-0 w-full bg-transparent outline-none text-sm text-foreground placeholder:text-transparent"
                aria-label="Search notes"
              />
              {/* Animated placeholder */}
              {!value && (
                <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ y: 14, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -14, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="text-sm text-muted-foreground"
                    >
                      {ROTATING_PLACEHOLDERS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                if (value) setValue("");
                else setOpen(false);
              }}
              className="h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-foreground/10 transition-smooth shrink-0"
              aria-label="Close search"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            {/* Glow underline */}
            <motion.div
              layoutId="search-glow"
              className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/40 to-transparent"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};