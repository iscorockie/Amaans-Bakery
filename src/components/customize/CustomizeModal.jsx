/**
 * "Customize & Order" modal — React Hook Form + Zod.
 *
 * RHF structure:
 *  - one `useForm` with `zodResolver(customizationSchema)`, mode "onChange"
 *  - `Controller` drives the custom ingredient picker (a Record<id, qty>)
 *  - `Controller` also drives the quantity stepper
 *  - `register` drives the plain notes textarea
 *  - `useWatch` powers the live summary + dynamic price
 *  - `formState.{errors,isSubmitting,isValid}` for feedback & guards
 */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { X, Check, ShoppingCart, ChefHat, Sparkles } from "lucide-react";

import { INGREDIENT_GROUPS } from "../../data/orderOptions";
import { customizationSchema, CUSTOMIZATION_DEFAULTS } from "../../schemas/customizationSchema";
import { priceCustomization } from "../../lib/pricing";
import { formatUGX } from "../../lib/format";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";
import ErrorText from "../ui/ErrorText";
import QtyStepper from "../ui/QtyStepper";
import SmartImage from "../ui/SmartImage";

/* ------------------------------------------------------------------ */
/* Provider so any page can open the modal                             */
/* ------------------------------------------------------------------ */

const CustomizeContext = createContext(null);

export function CustomizeProvider({ children }) {
  const [product, setProduct] = useState(null);
  const open = useCallback((p) => setProduct(p), []);
  const close = useCallback(() => setProduct(null), []);
  const value = useMemo(() => ({ open }), [open]);

  return (
    <CustomizeContext.Provider value={value}>
      {children}
      <CustomizeModal product={product} onClose={close} />
    </CustomizeContext.Provider>
  );
}

export function useCustomize() {
  const ctx = useContext(CustomizeContext);
  if (!ctx) throw new Error("useCustomize must be used inside <CustomizeProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Ingredient row — checkbox + qty stepper (inside one Controller)     */
/* ------------------------------------------------------------------ */

function IngredientRow({ ing, adds, onSet }) {
  const reduce = useReducedMotion();
  const qty = adds[ing.id] ?? 0;
  const active = qty > 0;

  return (
    <motion.div
      layout={reduce ? undefined : true}
      className={[
        "flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
        active ? "border-gold bg-gold/10" : "border-cocoa/10 bg-white hover:border-gold/60",
      ].join(" ")}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={active}
        onClick={() => onSet(ing.id, active ? 0 : 1)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span
          className={[
            "grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors",
            active ? "border-primary bg-primary text-cream" : "border-cocoa/25 bg-white text-transparent",
          ].join(" ")}
        >
          <Check className="h-3.5 w-3.5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-cocoa">{ing.label}</span>
          <span className="block text-[11px] font-semibold text-cocoa-light">
            + {formatUGX(ing.price)}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {active && (
          <motion.div
            key="qty"
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <QtyStepper small value={qty} min={1} max={20}
              onChange={(q) => onSet(ing.id, q)} label={`Quantity of ${ing.label}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Live summary panel                                                  */
/* ------------------------------------------------------------------ */

function LiveSummary({ product, adds, quantity }) {
  const reduce = useReducedMotion();
  const { unit, lines } = useMemo(() => priceCustomization(product, adds), [product, adds]);

  return (
    <aside className="card-surface flex h-fit flex-col gap-4 p-5 lg:sticky lg:top-6" aria-label="Order summary">
      <h4 className="flex items-center gap-2 font-display text-lg font-extrabold text-primary">
        <Sparkles className="h-4 w-4 text-gold-dark" aria-hidden /> Your bake so far
      </h4>

      <div className="flex flex-wrap gap-2" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.span
            layout={reduce ? undefined : true}
            key="base"
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold text-cream"
          >
            {product.name}
          </motion.span>
          {lines.map((l) => (
            <motion.span
              layout={reduce ? undefined : true}
              key={l.id}
              initial={reduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className="rounded-full bg-gold/25 px-3 py-1 text-[11px] font-extrabold text-cocoa"
            >
              {l.qty}× {l.label}
            </motion.span>
          ))}
        </AnimatePresence>
        {lines.length === 0 && (
          <p className="text-xs font-semibold text-cocoa-light">
            No extras yet — tick ingredients and watch them appear here.
          </p>
        )}
      </div>

      <div className="space-y-1.5 border-t border-dashed border-cocoa/15 pt-3 text-sm">
        <div className="flex justify-between text-cocoa-light">
          <span>Base price</span>
          <span className="tabular-nums">{formatUGX(product.price)}</span>
        </div>
        <div className="flex justify-between text-cocoa-light">
          <span>Extras</span>
          <span className="tabular-nums">{formatUGX((unit - product.price) * quantity)}</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-extrabold text-cocoa">Total</span>
          <motion.span
            key={unit * quantity}
            initial={reduce ? false : { scale: 1.12, color: "#B9854F" }}
            animate={{ scale: 1, color: "#7B1E1E" }}
            transition={{ type: "spring", stiffness: 400, damping: 24 }}
            className="font-display text-2xl font-extrabold tabular-nums"
          >
            {formatUGX(unit * quantity)}
          </motion.span>
        </div>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* The modal                                                           */
/* ------------------------------------------------------------------ */

function CustomizeModal({ product, onClose }) {
  const reduce = useReducedMotion();
  const { addItem } = useCart();
  const [shake, setShake] = useState(0);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customizationSchema),
    mode: "onChange",
    defaultValues: CUSTOMIZATION_DEFAULTS,
  });

  // Fresh form every time a different product is opened.
  useEffect(() => {
    if (product) reset(CUSTOMIZATION_DEFAULTS);
  }, [product, reset]);

  // Live values for the summary panel.
  const adds = useWatch({ control, name: "adds" });
  const quantity = useWatch({ control, name: "quantity" });

  const onSubmit = async (values) => {
    if (!product) return;
    await new Promise((r) => setTimeout(r, 500)); // simulate order prep
    const { unit, lines } = priceCustomization(product, values.adds);
    addItem({
      name: product.name,
      image: product.image,
      unitPrice: unit,
      qty: values.quantity,
      details: [
        ...lines.map((l) => `${l.qty}× ${l.label}`),
        values.notes.trim() ? `Note: ${values.notes.trim()}` : null,
      ].filter(Boolean),
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-cocoa/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={`Customize ${product.name}`}
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
            animate={
              reduce
                ? { opacity: 1 }
                : shake
                  ? { opacity: 1, y: 0, scale: 1, x: [0, -10, 10, -6, 6, 0] }
                  : { opacity: 1, y: 0, scale: 1 }
            }
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={
              shake
                ? { x: { duration: 0.4 }, type: "spring", stiffness: 380, damping: 28 }
                : { type: "spring", stiffness: 340, damping: 30 }
            }
            onAnimationComplete={() => setShake(0)}
            className="card-surface max-h-[90vh] w-full max-w-4xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-cocoa/10 bg-white px-6 py-4">
              <SmartImage
                src={product.image}
                alt={product.name}
                fallbackLabel={product.name}
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-extrabold text-cocoa">{product.name}</h3>
                <p className="text-xs font-bold text-cocoa-light">
                  Base {formatUGX(product.price)} · make it yours
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-full text-cocoa hover:bg-primary/10"
                aria-label="Close customization"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit(onSubmit, () => setShake((s) => s + 1))}
              className="grid max-h-[calc(90vh-88px)] gap-6 overflow-y-auto p-6 lg:grid-cols-[1fr_320px]"
              noValidate
            >
              <div className="space-y-6">
                {/* Ingredient groups */}
                {INGREDIENT_GROUPS.map((group) => (
                  <fieldset key={group.id}>
                    <legend className="mb-2 flex items-baseline gap-2">
                      <span className="font-display text-base font-extrabold text-primary">
                        {group.label}
                      </span>
                      <span className="text-[11px] font-semibold italic text-cocoa-light">
                        {group.hint}
                      </span>
                    </legend>
                    <Controller
                      name="adds"
                      control={control}
                      render={({ field }) => (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {group.items.map((ing) => (
                            <IngredientRow
                              key={ing.id}
                              ing={ing}
                              adds={field.value}
                              onSet={(id, qty) => {
                                const next = { ...field.value };
                                if (qty <= 0) delete next[id];
                                else next[id] = qty;
                                field.onChange(next);
                              }}
                            />
                          ))}
                        </div>
                      )}
                    />
                    <ErrorText>{errors.adds?.message}</ErrorText>
                  </fieldset>
                ))}

                {/* Notes for the chef */}
                <div>
                  <label htmlFor="cust-notes" className="mb-1.5 flex items-center gap-2 text-sm font-extrabold text-cocoa">
                    <ChefHat className="h-4 w-4 text-gold-dark" aria-hidden /> Notes for the chef
                  </label>
                  <textarea
                    id="cust-notes"
                    rows={3}
                    placeholder="Allergies, occasions, extra crunch… anything we should know?"
                    className={`input-base resize-none ${errors.notes ? "input-error" : ""}`}
                    aria-invalid={Boolean(errors.notes)}
                    aria-describedby="cust-notes-error"
                    {...register("notes")}
                  />
                  <ErrorText id="cust-notes-error">{errors.notes?.message}</ErrorText>
                </div>
              </div>

              {/* Summary + submit */}
              <div className="space-y-4">
                <LiveSummary product={product} adds={adds} quantity={quantity} />

                <div className="card-surface flex items-center justify-between gap-3 p-4">
                  <span className="text-sm font-extrabold text-cocoa">Quantity</span>
                  <Controller
                    name="quantity"
                    control={control}
                    render={({ field }) => (
                      <QtyStepper value={field.value} onChange={field.onChange} min={1} max={50} label="Order quantity" />
                    )}
                  />
                </div>
                <ErrorText>{errors.quantity?.message}</ErrorText>

                <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                  <ShoppingCart className="h-5 w-5" aria-hidden />
                  {isSubmitting ? "Adding…" : "Add to Cart"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
