/**
 * Controller-driven form controls for the special-order wizard.
 *
 * - `OptionCardGroup` : single-select grid of memoized `SelectionCard`s.
 * - `ChipGroup`       : multi-select memoized `IngredientChip`s.
 * - `TextField`       : register()-driven input/textarea with accessible
 *                       inline errors.
 *
 * Only the Controller re-renders on its field's change; the presentational
 * cards/chips are memoized so unrelated steps never pay for it.
 */
import { Controller } from "react-hook-form";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Info } from "lucide-react";

import SelectionCard from "./SelectionCard";
import IngredientChip from "./IngredientChip";
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
  return (
    <fieldset>
      <legend className="mb-3 font-display text-lg font-extrabold text-primary">{legend}</legend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className={`grid grid-cols-2 gap-3 ${columns}`} role="radiogroup" aria-label={legend}>
            {options.map((opt) => (
              <SelectionCard
                key={opt.id}
                option={opt}
                haloId={`halo-${name}`}
                selected={field.value === opt.id}
                onSelect={() =>
                  field.onChange(field.value === opt.id && toggleOff ? "" : opt.id)
                }
              />
            ))}
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

export function ChipGroup({ control, name, legend, options, error, errorId, softHintWhenEmpty }) {
  const reduce = useReducedMotion();

  return (
    <fieldset>
      <legend className="mb-3 font-display text-lg font-extrabold text-primary">{legend}</legend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => {
                const selected = (field.value || []).includes(opt.id);
                return (
                  <IngredientChip
                    key={opt.id}
                    option={opt}
                    selected={selected}
                    onToggle={() =>
                      field.onChange(
                        selected
                          ? (field.value || []).filter((v) => v !== opt.id)
                          : [...(field.value || []), opt.id]
                      )
                    }
                  />
                );
              })}
            </div>
            {/* Soft encouragement — never a hard block */}
            <AnimatePresence>
              {softHintWhenEmpty && (field.value || []).length === 0 && (
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  className="mt-3 flex items-start gap-2 rounded-xl bg-gold/15 px-4 py-3 text-xs font-bold text-cocoa-light"
                >
                  <Info className="mt-px h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
                  {softHintWhenEmpty}
                </motion.p>
              )}
            </AnimatePresence>
          </>
        )}
      />
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
