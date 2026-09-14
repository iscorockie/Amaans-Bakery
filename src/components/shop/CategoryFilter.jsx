/**
 * CategoryFilter — memoized tab row for the shop. The active pill is a shared
 * element (layoutId) that glides between categories.
 */
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

function CategoryFilter({ categories, active, onChange }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-wrap justify-center gap-2" role="tablist" aria-label="Product categories">
      {categories.map((c) => {
        const isActive = active === c.id;
        return (
          <button
            key={c.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(c.id)}
            className={[
              "relative rounded-full px-5 py-2.5 text-sm font-extrabold transition-colors",
              isActive ? "text-cream" : "text-cocoa-light hover:bg-primary/10 hover:text-primary",
            ].join(" ")}
          >
            {isActive && (
              <motion.span
                layoutId="cat-pill"
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                className="absolute inset-0 rounded-full bg-primary shadow-card shadow-primary/30"
                aria-hidden
              />
            )}
            <span className="relative z-10">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(CategoryFilter);
