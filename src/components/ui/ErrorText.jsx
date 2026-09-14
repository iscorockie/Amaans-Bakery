/**
 * Accessible inline field error. Rendered under the field, announced politely
 * via role="alert", and enters with a soft motion (respects reduced motion).
 */
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function ErrorText({ id, children }) {
  const reduce = useReducedMotion();
  if (!children) return null;
  return (
    <motion.p
      id={id}
      role="alert"
      initial={reduce ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-1.5 flex items-start gap-1.5 text-xs font-semibold text-danger"
    >
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{children}</span>
    </motion.p>
  );
}
