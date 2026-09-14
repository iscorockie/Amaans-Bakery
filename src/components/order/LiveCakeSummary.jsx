/**
 * Live "recipe card" summary — driven by `useWatch`, so every selection
 * updates it (and the price) in real time. Chips & rows use `layout`
 * animations for that buttery reflow.
 */
import { useMemo } from "react";
import { useWatch } from "react-hook-form";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CakeSlice, Ruler, Layers, CloudFog, Sparkles, Truck, CalendarDays, User } from "lucide-react";

import {
  findSize, findShape, findFlavor, findFrosting, findDecoration, findIngredient, findMethod,
} from "../../data/orderOptions";
import { priceSpecialOrder } from "../../lib/pricing";
import { formatUGX, prettyDate } from "../../lib/format";

function Row({ icon: Icon, label, children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div layout={reduce ? undefined : true} className="flex items-start gap-3">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-cocoa/50">{label}</p>
        <div className="text-sm font-bold text-cocoa">{children}</div>
      </div>
    </motion.div>
  );
}

function Chips({ ids, finder }) {
  const reduce = useReducedMotion();
  return (
    <span className="mt-1 flex flex-wrap gap-1.5">
      <AnimatePresence initial={false}>
        {ids.map((id) => {
          const item = finder(id);
          if (!item) return null;
          return (
            <motion.span
              key={id}
              layout={reduce ? undefined : true}
              initial={reduce ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", stiffness: 520, damping: 30 }}
              className="rounded-full bg-gold/25 px-2.5 py-0.5 text-[11px] font-extrabold text-cocoa"
            >
              {item.label}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </span>
  );
}

export default function LiveCakeSummary({ control }) {
  const reduce = useReducedMotion();
  const v = useWatch({ control });
  const quote = useMemo(() => priceSpecialOrder(v), [v]);

  return (
    <aside
      className="card-surface flex h-fit flex-col gap-5 overflow-hidden p-6 lg:sticky lg:top-24"
      aria-label="Live cake summary and price estimate"
    >
      <div className="-mx-6 -mt-6 mb-1 flex items-center gap-3 rounded-t-2xl border-b border-gold/20 bg-warm-glow px-6 py-5">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-gold shadow-card shadow-primary/30">
          <CakeSlice className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <h3 className="font-display text-lg font-extrabold text-primary">Your Cake, Live</h3>
          <p className="text-[11px] font-bold text-cocoa-light">updates as you design</p>
        </div>
      </div>

      <div className="space-y-4">
        {(v.size || v.shape) && (
          <Row icon={Ruler} label="Size & shape">
            {[findSize(v.size)?.label, findShape(v.shape)?.label].filter(Boolean).join(" · ") || "—"}
          </Row>
        )}
        {v.flavor && (
          <Row icon={CakeSlice} label="Flavor">
            {v.flavor === "custom" ? `Custom: ${v.customFlavor || "…"}` : findFlavor(v.flavor)?.label}
          </Row>
        )}
        <Row icon={Layers} label="Fillings">
          {v.fillings?.length ? <Chips ids={v.fillings} finder={findIngredient} /> : <span className="text-cocoa/50">None yet</span>}
        </Row>
        <Row icon={CloudFog} label="Frosting">
          {v.frosting ? findFrosting(v.frosting)?.label : <span className="text-cocoa/50">Not chosen</span>}
        </Row>
        <Row icon={Sparkles} label="Decorations">
          {v.decorations?.length ? (
            <Chips ids={v.decorations} finder={findDecoration} />
          ) : (
            <span className="text-cocoa/50">None yet</span>
          )}
          {v.customMessage && (
            <p className="mt-1.5 rounded-lg bg-cream px-3 py-1.5 text-xs italic text-cocoa-light">
              “{v.customMessage}”
            </p>
          )}
        </Row>
        {(v.method || v.date || v.name) && (
          <Row icon={v.method === "delivery" ? Truck : User} label="Getting it to you">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {v.method && <span>{findMethod(v.method)?.label}</span>}
              {v.date && (
                <span className="inline-flex items-center gap-1 text-cocoa-light">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {prettyDate(v.date)}
                </span>
              )}
              {v.time && <span className="text-cocoa-light">{v.time}</span>}
            </span>
            {v.name && <span className="block text-xs text-cocoa-light">for {v.name}</span>}
          </Row>
        )}
      </div>

      {/* Price estimate */}
      <div className="space-y-1.5 border-t border-dashed border-cocoa/15 pt-4">
        <AnimatePresence initial={false}>
          {quote.lines.map((l) => (
            <motion.p
              key={l.label}
              layout={reduce ? undefined : true}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, x: 8 }}
              className="flex justify-between text-xs font-semibold text-cocoa-light tabular-nums"
            >
              <span className="truncate pr-2">{l.label}</span>
              <span>{formatUGX(l.amount)}</span>
            </motion.p>
          ))}
        </AnimatePresence>
        {quote.lines.length === 0 && (
          <p className="text-xs font-semibold text-cocoa-light">
            Start choosing — your estimate builds itself here.
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-extrabold text-cocoa">Estimate</span>
          <motion.span
            key={quote.total}
            initial={reduce ? false : { scale: 1.15, color: "#B9854F" }}
            animate={{ scale: 1, color: "#7B1E1E" }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            className="font-display text-2xl font-extrabold tabular-nums"
            aria-live="polite"
          >
            {formatUGX(quote.total)}
          </motion.span>
        </div>
        <p className="text-[10px] font-semibold text-cocoa/50">
          Final quote confirmed on WhatsApp before baking.
        </p>
      </div>
    </aside>
  );
}
