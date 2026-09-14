/**
 * Brand button with micro-interactions. `as`/`to` friendly via props spread —
 * wrap with <Link> externally when navigation is needed.
 */
import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-primary text-cream hover:bg-primary-700 shadow-card shadow-primary/25 focus-visible:ring-primary/40",
  gold: "bg-gold text-cocoa hover:bg-gold-dark focus-visible:ring-gold/50 shadow-card shadow-gold/25",
  outline:
    "border-2 border-primary/70 text-primary hover:bg-primary hover:text-cream focus-visible:ring-primary/30",
  // For dark/photographic backgrounds (hero) — light stroke & text so the
  // label always reads clearly; never rely on overriding `outline`.
  outlineLight:
    "border-2 border-cream/80 text-cream hover:bg-cream hover:text-primary focus-visible:ring-cream/40",
  ghost: "text-primary hover:bg-primary/10 focus-visible:ring-primary/30",
  whatsapp:
    "bg-[#1FAF57] text-white hover:bg-[#178A45] shadow-card shadow-[#1FAF57]/25 focus-visible:ring-[#1FAF57]/40",
};

const SIZES = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
  sm: "px-3.5 py-2 text-xs",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading = false, className = "", children, disabled, ...rest },
  ref
) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      ref={ref}
      whileHover={reduce ? undefined : { y: -1 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-wide",
        "focus-visible:outline-none focus-visible:ring-4 transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
        VARIANTS[variant],
        SIZES[size],
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </motion.button>
  );
});

export default Button;
