/**
 * Post-submit success state — animated check entrance, order recap and a
 * one-tap WhatsApp confirmation.
 */
import { motion, useReducedMotion } from "framer-motion";
import { Check, MessageCircle, RotateCcw, PartyPopper } from "lucide-react";

import {
  findSize, findShape, findFlavor, findFrosting, findIngredient, findDecoration, findMethod,
} from "../../data/orderOptions";
import { formatUGX, prettyDate } from "../../lib/format";
import { whatsAppLink } from "../../lib/whatsapp";
import Button from "../ui/Button";

const EASE = [0.22, 1, 0.36, 1];

export default function SuccessPanel({ order, onReset }) {
  const reduce = useReducedMotion();
  const v = order.values;

  const lines = [
    `Size/shape: ${findSize(v.size)?.label} · ${findShape(v.shape)?.label}`,
    `Flavor: ${v.flavor === "custom" ? v.customFlavor : findFlavor(v.flavor)?.label}`,
    v.fillings?.length && `Fillings: ${v.fillings.map((i) => findIngredient(i)?.label).join(", ")}`,
    v.frosting && `Frosting: ${findFrosting(v.frosting)?.label}`,
    v.decorations?.length && `Decor: ${v.decorations.map((i) => findDecoration(i)?.label).join(", ")}`,
    v.customMessage && `Message: “${v.customMessage}”`,
    `${findMethod(v.method)?.label} · ${prettyDate(v.date)} · ${v.time}`,
    `Contact: ${v.name} · ${v.phone}`,
  ].filter(Boolean);

  const waText = [
    `Hello Amaan’s Bakery! 🎂`,
    `I just designed a special cake online (ref ${order.code}):`,
    ...lines.map((l) => `• ${l}`),
    ``,
    `Estimated total: ${formatUGX(order.total)}`,
    `Please confirm my bake!`,
  ].join("\n");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="card-surface mx-auto max-w-2xl overflow-hidden"
      role="status"
    >
      <div className="bg-primary px-8 py-10 text-center">
        <motion.span
          initial={reduce ? false : { scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gold text-cocoa shadow-card"
        >
          <Check className="h-10 w-10" strokeWidth={3} aria-hidden />
        </motion.span>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
          className="mt-5 flex items-center justify-center gap-2 font-display text-3xl font-extrabold text-cream"
        >
          <PartyPopper className="h-6 w-6 text-gold" aria-hidden /> Order received!
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-2 text-sm text-cream/80"
        >
          Reference <span className="font-extrabold text-gold">{order.code}</span> — our chefs are
          warming the ovens. Confirm on WhatsApp to lock in your slot.
        </motion.p>
      </div>

      <div className="space-y-5 px-8 py-8">
        <ul className="space-y-2">
          {lines.map((l, i) => (
            <motion.li
              key={l}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.06, duration: 0.4, ease: EASE }}
              className="flex items-start gap-2 text-sm font-semibold text-cocoa-light"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
              {l}
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center justify-between rounded-2xl bg-cream px-5 py-4">
          <span className="text-sm font-extrabold text-cocoa">Estimated total</span>
          <span className="font-display text-2xl font-extrabold text-primary tabular-nums">
            {formatUGX(order.total)}
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a href={whatsAppLink(waText)} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="whatsapp" size="lg" className="w-full">
              <MessageCircle className="h-5 w-5" aria-hidden /> Confirm on WhatsApp
            </Button>
          </a>
          <Button variant="ghost" size="lg" onClick={onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden /> Bake another
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
