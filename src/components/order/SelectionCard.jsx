/**
 * SelectionCard — memoized presentational option card used by single-select
 * groups. The gold halo glides between cards via `layoutId` (shared element).
 * `toggleOff` lets "soft" fields (e.g. frosting) be deselected by re-tapping.
 */
import { memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { formatUGX } from "../../lib/format";

function SelectionCard({ option, selected, onSelect, haloId }) {
  const reduce = useReducedMotion();
  const Icon = option.icon;

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      onClick={onSelect}
      className={[
        "relative flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-colors",
        selected
          ? "border-gold bg-white shadow-card"
          : "border-cocoa/10 bg-white/60 hover:border-gold/60 hover:bg-white",
      ].join(" ")}
    >
      {/* Sliding selection halo (shared element) */}
      {selected && (
        <motion.span
          layoutId={haloId}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 34 }}
          className="absolute inset-0 rounded-2xl ring-2 ring-gold ring-offset-2 ring-offset-cream"
          aria-hidden
        />
      )}
      <span className="flex w-full items-center justify-between gap-2">
        {Icon && <Icon className="h-5 w-5 text-gold-dark" aria-hidden />}
        <AnimatePresence>
          {selected && (
            <motion.span
              initial={reduce ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              exit={reduce ? undefined : { scale: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 26 }}
              className="grid h-5 w-5 place-items-center rounded-full bg-primary text-cream"
            >
              <Check className="h-3 w-3" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="text-sm font-extrabold text-cocoa">{option.label}</span>
      {option.note && <span className="text-[11px] font-semibold text-cocoa-light">{option.note}</span>}
      {option.serves && <span className="text-[11px] font-semibold text-cocoa-light">{option.serves}</span>}
      {typeof option.price === "number" && (
        <span className="mt-1 text-[11px] font-extrabold text-primary tabular-nums">
          {option.price === 0 ? "Included" : `+ ${formatUGX(option.price)}`}
        </span>
      )}
    </motion.button>
  );
}

export default memo(SelectionCard);
