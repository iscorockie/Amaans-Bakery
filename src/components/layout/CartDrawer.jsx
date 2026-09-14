/**
 * Slide-in cart drawer. Items animate in/out with layout animations; the
 * order is confirmed over WhatsApp (the bakery's real workflow).
 */
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ShoppingBag, MessageCircle, Trash2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatUGX } from "../../lib/format";
import { orderToWhatsAppText, whatsAppLink } from "../../lib/whatsapp";
import QtyStepper from "../ui/QtyStepper";
import SmartImage from "../ui/SmartImage";
import Button from "../ui/Button";

export default function CartDrawer() {
  const { items, open, setOpen, removeItem, setQty, total, clear } = useCart();
  const reduce = useReducedMotion();

  const waText = orderToWhatsAppText({
    title: "My basket:",
    lines: items.map((i) => `${i.qty} × ${i.name} — ${formatUGX(i.unitPrice * i.qty)}`),
    total: formatUGX(total),
  });

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-cocoa/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cocoa/10 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-primary">
                <ShoppingBag className="h-5 w-5" aria-hidden /> Your Basket
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-cocoa hover:bg-primary/10"
                aria-label="Close cart"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
                    <ShoppingBag className="h-7 w-7" aria-hidden />
                  </span>
                  <p className="font-display text-lg font-bold text-cocoa">Your basket is empty</p>
                  <p className="max-w-[220px] text-sm text-cocoa-light">
                    Warm mandazi, croissants, a custom cake… let’s fix that.
                  </p>
                  <Button variant="gold" size="sm" onClick={() => setOpen(false)}>
                    Browse the menu
                  </Button>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.key}
                        layout={reduce ? undefined : true}
                        initial={reduce ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="card-surface flex gap-3 p-3"
                      >
                        <SmartImage
                          src={item.image}
                          alt={item.name}
                          fallbackLabel={item.name}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-extrabold text-cocoa">{item.name}</p>
                            <button
                              onClick={() => removeItem(item.key)}
                              className="text-cocoa/40 transition-colors hover:text-danger"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </button>
                          </div>
                          {item.details?.length > 0 && (
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-cocoa-light">
                              {item.details.join(" · ")}
                            </p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <QtyStepper small value={item.qty} min={1} max={50}
                              onChange={(q) => setQty(item.key, q)} label={`Quantity of ${item.name}`} />
                            <span className="text-sm font-extrabold text-primary tabular-nums">
                              {formatUGX(item.unitPrice * item.qty)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="space-y-3 border-t border-cocoa/10 bg-white px-5 py-4">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-cocoa-light">Estimated total</span>
                  <motion.span
                    key={total}
                    initial={reduce ? false : { scale: 1.08, color: "#B9854F" }}
                    animate={{ scale: 1, color: "#7B1E1E" }}
                    className="font-display text-xl font-extrabold tabular-nums"
                  >
                    {formatUGX(total)}
                  </motion.span>
                </div>
                <a href={whatsAppLink(waText)} target="_blank" rel="noreferrer" className="block">
                  <Button variant="whatsapp" className="w-full" size="lg">
                    <MessageCircle className="h-5 w-5" aria-hidden /> Confirm order on WhatsApp
                  </Button>
                </a>
                <button
                  onClick={clear}
                  className="w-full text-center text-xs font-bold text-cocoa/50 hover:text-danger"
                >
                  Clear basket
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
