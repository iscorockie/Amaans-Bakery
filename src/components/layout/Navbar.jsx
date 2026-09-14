/**
 * Sticky navbar — shared-element underline via layoutId glides between the
 * active route, cart badge springs on count change, mobile menu animates.
 */
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShoppingBag, Menu, X, Cake } from "lucide-react";
import { useCart } from "../../context/CartContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop", end: false },
  { to: "/order", label: "Bake Your Cake", end: false, highlight: true },
];

function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Amaan's Bakery home">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary shadow-card shadow-primary/30">
        <Cake className="h-5 w-5 text-gold" aria-hidden />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-extrabold text-primary">Amaan’s Bakery</span>
        <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-dark">
          Freshly Baked · Perfectly Tasty
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-cocoa/10 bg-cream/90 backdrop-blur-md">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <BrandMark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className="relative px-4 py-2">
              {({ isActive }) => (
                <span
                  className={[
                    "relative z-10 text-sm font-bold tracking-wide",
                    l.highlight
                      ? isActive
                        ? "text-primary"
                        : "text-primary/80 hover:text-primary"
                      : isActive
                        ? "text-primary"
                        : "text-cocoa-light hover:text-primary",
                  ].join(" ")}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full bg-gold"
                      aria-hidden
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Cart */}
          <motion.button
            whileTap={reduce ? undefined : { scale: 0.92 }}
            onClick={() => setOpen(true)}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-cocoa/10 bg-white text-cocoa hover:border-gold hover:text-primary transition-colors"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag className="h-5 w-5" aria-hidden />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={reduce ? false : { scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 600, damping: 22 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-cream"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile menu toggle */}
          <button
            className="grid h-10 w-10 place-items-center rounded-full text-cocoa hover:bg-primary/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-cocoa/10 bg-cream md:hidden"
            aria-label="Mobile"
          >
            <div className="container-x flex flex-col py-3">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-3 text-sm font-bold ${
                      isActive ? "bg-primary/10 text-primary" : "text-cocoa-light"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
