/**
 * The six steps of "Bake Your Own Cake". Each step is presentational —
 * all state lives in the single React Hook Form instance owned by
 * SpecialOrderPage, so values persist across steps and navigation.
 */
import { useWatch } from "react-hook-form";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Circle, Square, Heart, Hash, Shapes, Cookie, Sparkles, Info, Truck, Store,
} from "lucide-react";

import {
  CAKE_SIZES, CAKE_SHAPES, CAKE_FLAVORS,
  SPECIAL_FILLINGS, SPECIAL_FROSTINGS, SPECIAL_DECORATIONS,
  DELIVERY_METHODS, TIME_SLOTS,
} from "../../data/orderOptions";
import { tomorrowISO } from "../../lib/format";
import { OptionCardGroup, ChipGroup, TextField } from "./controls";

const SHAPE_ICONS = { round: Circle, square: Square, heart: Heart, number: Hash, custom: Shapes };
const sizeOptions = CAKE_SIZES.map((s) => ({ ...s }));
const shapeOptions = CAKE_SHAPES.map((s) => ({ ...s, icon: SHAPE_ICONS[s.id] }));
const flavorOptions = CAKE_FLAVORS.map((f) => ({ ...f, icon: Cookie }));
const methodOptions = DELIVERY_METHODS.map((m) => ({ ...m, icon: m.id === "pickup" ? Store : Truck }));

/* --------------------------------------------- Step 1 — Size & Shape */
export function StepSizeShape({ control, errors }) {
  return (
    <div className="space-y-8">
      <OptionCardGroup
        control={control}
        name="size"
        legend="How big should we bake?"
        options={sizeOptions}
        columns="sm:grid-cols-4"
        error={errors.size}
        errorId="step-size-error"
      />
      <OptionCardGroup
        control={control}
        name="shape"
        legend="Pick a shape"
        options={shapeOptions}
        columns="sm:grid-cols-5"
        error={errors.shape}
        errorId="step-shape-error"
      />
    </div>
  );
}

/* ------------------------------------------------- Step 2 — Flavor */
export function StepFlavor({ control, register, errors }) {
  const flavor = useWatch({ control, name: "flavor" });
  const reduce = useReducedMotion();

  return (
    <div className="space-y-6">
      <OptionCardGroup
        control={control}
        name="flavor"
        legend="Choose your cake flavor"
        options={flavorOptions}
        columns="sm:grid-cols-4"
        error={errors.flavor}
        errorId="step-flavor-error"
      />
      <AnimatePresence>
        {flavor === "custom" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <TextField
              register={register}
              name="customFlavor"
              label="Describe your dream flavor"
              placeholder="e.g. honey-lavender with a hint of citrus…"
              error={errors.customFlavor}
              maxLength={60}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------ Step 3 — Fillings */
export function StepFillings({ control, errors }) {
  const fillings = useWatch({ control, name: "fillings" }) || [];
  return (
    <div className="space-y-4">
      <ChipGroup
        control={control}
        name="fillings"
        legend="Layer in some fillings (optional)"
        options={SPECIAL_FILLINGS}
        error={errors.fillings}
        errorId="step-fillings-error"
      />
      <AnimatePresence>
        {fillings.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2 rounded-xl bg-gold/15 px-4 py-3 text-xs font-bold text-cocoa-light"
          >
            <Info className="mt-px h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            No fillings yet — that’s okay! A layer of ganache or passion curd makes slices sing,
            but a classic sponge is lovely too.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------------------- Step 4 — Frosting */
export function StepFrosting({ control, errors }) {
  const frosting = useWatch({ control, name: "frosting" });
  return (
    <div className="space-y-4">
      <OptionCardGroup
        control={control}
        name="frosting"
        legend="Choose a frosting / covering"
        options={SPECIAL_FROSTINGS}
        columns="sm:grid-cols-3"
        toggleOff
        error={errors.frosting}
        errorId="step-frosting-error"
      />
      <AnimatePresence>
        {!frosting && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2 rounded-xl bg-gold/15 px-4 py-3 text-xs font-bold text-cocoa-light"
          >
            <Info className="mt-px h-4 w-4 shrink-0 text-gold-dark" aria-hidden />
            Skipping frosting? A “naked” cake is charming — but tap a card if you change your
            mind (tap again to skip).
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------------------- Step 5 — Decorations */
export function StepDecorations({ control, register, errors }) {
  const message = useWatch({ control, name: "customMessage" }) || "";
  return (
    <div className="space-y-6">
      <ChipGroup
        control={control}
        name="decorations"
        legend="Decorations & toppings"
        options={SPECIAL_DECORATIONS}
        error={errors.decorations}
        errorId="step-decorations-error"
      />
      <TextField
        register={register}
        name="customMessage"
        label="Message on the cake (optional)"
        placeholder="e.g. “Happy Birthday Aisha — 25 & glowing!”"
        error={errors.customMessage}
        textarea
        rows={2}
        maxLength={100}
        rightSlot={
          <span
            className={`text-[11px] font-extrabold tabular-nums ${
              message.length > 100 ? "text-danger" : message.length > 80 ? "text-gold-dark" : "text-cocoa-light"
            }`}
            aria-live="polite"
          >
            {message.length}/100
          </span>
        }
      />
    </div>
  );
}

/* ------------------------------------- Step 6 — Delivery details */
export function StepDelivery({ control, register, errors }) {
  const method = useWatch({ control, name: "method" });
  const reduce = useReducedMotion();

  return (
    <div className="space-y-7">
      <OptionCardGroup
        control={control}
        name="method"
        legend="Pickup or delivery?"
        options={methodOptions}
        columns="sm:grid-cols-2"
        error={errors.method}
        errorId="step-method-error"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField register={register} name="name" label="Your name" placeholder="e.g. Aisha Namutebi" error={errors.name} />
        <TextField register={register} name="phone" label="WhatsApp / phone number" placeholder="0772 606296 or +256 772 606296" type="tel" error={errors.phone} />
      </div>

      <AnimatePresence>
        {method === "delivery" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={reduce ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <TextField
              register={register}
              name="address"
              label="Delivery address"
              placeholder="House / plot, street, area — e.g. House 14, Kira Rd, Bulindo"
              error={errors.address}
              maxLength={200}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField register={register} name="date" label="Preferred date" type="date" min={tomorrowISO()} error={errors.date} />
        <div>
          <label htmlFor="field-time" className="mb-1.5 block text-sm font-extrabold text-cocoa">
            Preferred time slot
          </label>
          <select
            id="field-time"
            aria-invalid={Boolean(errors.time)}
            aria-describedby={errors.time ? "field-time-error" : undefined}
            className={`input-base appearance-none ${errors.time ? "input-error" : ""}`}
            {...register("time")}
          >
            <option value="">Choose a slot…</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.time && <p id="field-time-error" role="alert" className="mt-1.5 text-xs font-semibold text-danger">{errors.time.message}</p>}
        </div>
      </div>

      <TextField
        register={register}
        name="notes"
        label="Anything else? (optional)"
        placeholder="Gate codes, surprises, allergies…"
        error={errors.notes}
        textarea
        rows={3}
        maxLength={500}
      />
    </div>
  );
}

export const STEP_COMPONENTS = [
  StepSizeShape,
  StepFlavor,
  StepFillings,
  StepFrosting,
  StepDecorations,
  StepDelivery,
];

export { Sparkles };
