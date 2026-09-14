/**
 * Accessible +/- quantity stepper (used in cart & customization modal).
 * Controlled: value + onChange(number).
 */
import { Minus, Plus } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function QtyStepper({ value = 1, onChange, min = 1, max = 50, small = false, label }) {
  const reduce = useReducedMotion();
  const btn = [
    "grid place-items-center rounded-full border border-cocoa/15 bg-cream text-cocoa",
    "hover:bg-gold/30 hover:border-gold active:scale-90 transition disabled:opacity-40",
    small ? "h-7 w-7" : "h-9 w-9",
  ].join(" ");

  const tap = reduce ? undefined : { scale: 0.88 };

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={label || "Quantity"}>
      <motion.button
        type="button"
        whileTap={tap}
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className={small ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      </motion.button>
      <span
        className={`text-center font-extrabold tabular-nums text-cocoa ${small ? "w-6 text-sm" : "w-8"}`}
        aria-live="polite"
      >
        {value}
      </span>
      <motion.button
        type="button"
        whileTap={tap}
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className={small ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />
      </motion.button>
    </div>
  );
}
