/**
 * Section heading with a gold rule and optional overline — consistent voice
 * across the storefront.
 */
import { motion, useReducedMotion } from "framer-motion";

export default function SectionHeading({ overline, title, sub, align = "center" }) {
  const reduce = useReducedMotion();
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`flex flex-col gap-3 ${alignCls}`}
    >
      {overline && (
        <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold-dark">
          {overline}
        </span>
      )}
      <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">{title}</h2>
      <span className="h-1 w-16 rounded-full bg-gold" aria-hidden />
      {sub && <p className="max-w-xl text-sm leading-relaxed text-cocoa-light sm:text-base">{sub}</p>}
    </motion.div>
  );
}
