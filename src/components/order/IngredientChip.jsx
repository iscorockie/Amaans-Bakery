/**
 * IngredientChip — memoized multi-select chip. Springs into place and
 * participates in layout reflow when siblings appear/disappear.
 */
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { formatUGX } from "../../lib/format";

function IngredientChip({ option, selected, onToggle }) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      role="checkbox"
      aria-checked={selected}
      whileTap={reduce ? undefined : { scale: 0.94 }}
      layout={reduce ? undefined : true}
      onClick={onToggle}
      className={[
        "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors",
        selected
          ? "border-primary bg-primary text-cream shadow-card shadow-primary/25"
          : "border-cocoa/15 bg-white text-cocoa-light hover:border-gold hover:text-cocoa",
      ].join(" ")}
    >
      {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
      {option.label}
      {option.price > 0 && (
        <span className={`text-[11px] font-extrabold tabular-nums ${selected ? "text-gold" : "text-primary"}`}>
          +{formatUGX(option.price)}
        </span>
      )}
    </motion.button>
  );
}

export default memo(IngredientChip);
