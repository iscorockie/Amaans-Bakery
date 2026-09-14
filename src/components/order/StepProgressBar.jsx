/**
 * Step progress — spring-animated fill line + dots that flip to checks.
 * Transforms/widths only; reduced-motion friendly.
 */
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { STEP_TITLES } from "../../schemas/specialOrderSchemas";

export default function StepProgressBar({ step, onStepClick }) {
  const reduce = useReducedMotion();
  const pct = (step / (STEP_TITLES.length - 1)) * 100;

  return (
    <div aria-label={`Step ${step + 1} of ${STEP_TITLES.length}: ${STEP_TITLES[step].title}`}>
      <div className="relative">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cocoa/10" />
        {/* Fill */}
        <motion.div
          className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-gold"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 22 }}
        />
        <ol className="relative flex justify-between">
          {STEP_TITLES.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s.title} className="flex flex-col items-center gap-1.5">
                <motion.span
                  animate={
                    current && !reduce
                      ? { scale: [1, 1.12, 1] }
                      : { scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  aria-current={current ? "step" : undefined}
                  {...(done && onStepClick
                    ? {
                        role: "button",
                        tabIndex: 0,
                        "aria-label": `Go back to step ${i + 1}: ${s.title}`,
                        onClick: () => onStepClick(i),
                        onKeyDown: (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onStepClick(i);
                          }
                        },
                      }
                    : {})}
                  className={[
                    "grid h-9 w-9 place-items-center rounded-full border-2 text-xs font-extrabold transition-colors",
                    done
                      ? "cursor-pointer border-primary bg-primary text-cream hover:bg-primary-700"
                      : current
                        ? "border-gold bg-white text-primary shadow-card"
                        : "border-cocoa/15 bg-white text-cocoa/40",
                  ].join(" ")}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {done ? (
                      <motion.span
                        key="check"
                        initial={reduce ? false : { scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={reduce ? undefined : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 600, damping: 26 }}
                      >
                        <Check className="h-4 w-4" aria-hidden />
                      </motion.span>
                    ) : (
                      <motion.span key="num" initial={false} animate={{ scale: 1 }}>
                        {i + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.span>
                <span
                  className={[
                    "hidden text-[10px] font-extrabold uppercase tracking-wider sm:block",
                    current ? "text-primary" : done ? "text-cocoa-light" : "text-cocoa/40",
                  ].join(" ")}
                >
                  {s.title}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
