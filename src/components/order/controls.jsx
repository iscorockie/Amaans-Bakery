/**
 * Custom form controls for the special-order flow.
 *
 * - `OptionCardGroup`  : single-select card grid (Controller-driven). A gold
 *    highlight glides between cards via `layoutId` (shared-element feel).
 *    Optionally toggleable off (for "soft" fields like frosting).
 * - `ChipGroup`        : multi-select chips (Controller-driven) with layout
 *    animation as chips light up.
 * - `TextField`        : register()-driven input/textarea with friendly
 *    inline errors (ErrorText) + aria wiring.
 */
import { Controller } from "react-hook-form";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { formatUGX } from "../../lib/format";
import ErrorText from "../ui/ErrorText";

/* ------------------------------------------------------------------ */
/* OptionCardGroup — single select cards                               */
/* ------------------------------------------------------------------ */

export function OptionCardGroup({
  control,
  name,
  legend,
  options,
  columns = "sm:grid-cols-3",
  toggleOff = false,
  error,
  errorId,
}) {
  const reduce = useReducedMotion();

  return (
    <fieldset>
      <legend className="mb-3 font-display text-lg font-extrabold text-primary">{legend}</legend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`grid grid-cols-2 gap-3 ${columns}`} role="radiogroup" aria-label={legend}>
            {options.map((opt) => {
              const selected = field.value === opt.id;
              const Icon = opt.icon;
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  whileTap={reduce ? undefined : { scale: 0.97 }}
                  onClick={() => field.onChange(selected && toggleOff ? "" : opt.id)}
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
                      layoutId={`halo-${name}`}
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
                  <span className="text-sm font-extrabold text-cocoa">{opt.label}</span>
                  {opt.note && <span className="text-[11px] font-semibold text-cocoa-light">{opt.note}</span>}
                  {opt.serves && <span className="text-[11px] font-semibold text-cocoa-light">{opt.serves}</span>}
                  {typeof opt.price === "number" && (
                    <span className="mt-1 text-[11px] font-extrabold text-primary tabular-nums">
                      {opt.price === 0 ? "Included" : `+ ${formatUGX(opt.price)}`}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      />
      <ErrorText id={errorId}>{error?.message}</ErrorText>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* ChipGroup — multi select                                            */
/* ------------------------------------------------------------------ */

export function ChipGroup({ control, name, legend, options, error, errorId, hint }) {
  const reduce = useReducedMotion();

  return (
    <fieldset>
      <legend className="mb-3 font-display text-lg font-extrabold text-primary">{legend}</legend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => {
              const selected = (field.value || []).includes(opt.id);
              return (
                <motion.button
                  key={opt.id}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  whileTap={reduce ? undefined : { scale: 0.94 }}
                  layout={reduce ? undefined : true}
                  onClick={() =>
                    field.onChange(
                      selected ? field.value.filter((v) => v !== opt.id) : [...(field.value || []), opt.id]
                    )
                  }
                  className={[
                    "flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors",
                    selected
                      ? "border-primary bg-primary text-cream shadow-card shadow-primary/25"
                      : "border-cocoa/15 bg-white text-cocoa-light hover:border-gold hover:text-cocoa",
                  ].join(" ")}
                >
                  {selected && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {opt.label}
                  {opt.price > 0 && (
                    <span className={`text-[11px] font-extrabold tabular-nums ${selected ? "text-gold" : "text-primary"}`}>
                      +{formatUGX(opt.price)}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      />
      {hint && <p className="mt-2 text-xs font-semibold italic text-gold-dark">{hint}</p>}
      <ErrorText id={errorId}>{error?.message}</ErrorText>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* TextField — register()-driven                                       */
/* ------------------------------------------------------------------ */

export function TextField({
  register,
  name,
  label,
  error,
  type = "text",
  placeholder,
  textarea = false,
  rows = 3,
  min,
  maxLength,
  id,
  rightSlot,
}) {
  const fieldId = id || `field-${name}`;
  const errId = `${fieldId}-error`;
  const shared = {
    id: fieldId,
    placeholder,
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? errId : undefined,
    className: `input-base ${error ? "input-error" : ""} ${textarea ? "resize-none" : ""}`,
    ...register(name),
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={fieldId} className="text-sm font-extrabold text-cocoa">
          {label}
        </label>
        {rightSlot}
      </div>
      {textarea ? <textarea rows={rows} {...shared} /> : <input type={type} min={min} maxLength={maxLength} {...shared} />}
      <ErrorText id={errId}>{error?.message}</ErrorText>
    </div>
  );
}
