/**
 * Hero — warm bakery imagery, brand tagline and the two primary CTAs.
 * Entrance choreography respects reduced motion.
 */
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CakeSlice, Croissant, CalendarClock, Heart, Star } from "lucide-react";
import Button from "../ui/Button";

const MARQUEE = [
  "Mandazi", "Butter Croissants", "Red Velvet", "Chapati", "Tiramisu",
  "Matooke Banana Bread", "Cupcakes", "Beef Samosas", "Cheesecake", "Cinnamon Rolls",
];

const EASE = [0.22, 1, 0.36, 1];

const fadeUp = (reduce, delay = 0) => ({
  initial: reduce ? false : { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
});

const PERKS = [
  { icon: Croissant, label: "Baked fresh daily" },
  { icon: CalendarClock, label: "Same-week special orders" },
  { icon: Heart, label: "Made with Ugandan heart" },
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Imagery */}
      <div className="absolute inset-0">
        <motion.img
          src="images/hero-bakery.jpg"
          alt="Amaan's Bakery counter filled with fresh breads and cakes"
          initial={reduce ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: EASE }}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-cocoa-fade" />
      </div>

      {/* Floating rating card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.55, type: "spring", stiffness: 260, damping: 22 }}
        className="pointer-events-none absolute bottom-28 right-10 z-10 hidden select-none xl:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl bg-white/95 px-6 py-5 shadow-card backdrop-blur"
        >
          <p className="flex items-center gap-1" role="img" aria-label="Rated 4.9 out of 5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden />
            ))}
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold text-cocoa">4.9/5</p>
          <p className="text-xs font-bold text-cocoa-light">2,300+ happy orders in Kampala</p>
        </motion.div>
      </motion.div>

      <div className="container-x relative flex min-h-[68vh] items-center py-20 sm:py-24 lg:py-28">
        <div className="max-w-2xl space-y-6">
          <motion.p {...fadeUp(reduce)} className="inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-gold backdrop-blur">
            Kira Bulindo · Kampala · Uganda
          </motion.p>

          <motion.h1
            {...fadeUp(reduce, 0.08)}
            className="font-display text-5xl font-extrabold leading-[1.05] text-cream sm:text-6xl lg:text-7xl"
          >
            Freshly Baked,
            <span className="block text-gold">Perfectly Tasty.</span>
          </motion.h1>

          <motion.p {...fadeUp(reduce, 0.16)} className="max-w-lg text-base leading-relaxed text-cream/85 sm:text-lg">
            From golden mandazi to show-stopping celebration cakes — Amaan’s Bakery bakes the
            flavors of home with a world-class touch.
          </motion.p>

          <motion.div {...fadeUp(reduce, 0.24)} className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Link to="/shop" className="w-full sm:w-auto">
              <Button size="lg" variant="gold" className="w-full sm:w-auto">
                Shop Now <ArrowRight className="h-5 w-5" aria-hidden />
              </Button>
            </Link>
            <Link to="/order" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-cream/70 text-cream hover:bg-cream hover:text-primary">
                <CakeSlice className="h-5 w-5" aria-hidden /> Special Order – Bake Your Cake
              </Button>
            </Link>
          </motion.div>

          {/* Perk chips */}
          <motion.ul {...fadeUp(reduce, 0.32)} className="flex flex-wrap gap-3 pt-2">
            {PERKS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2 text-xs font-bold text-cream/90 backdrop-blur"
              >
                <Icon className="h-4 w-4 text-gold" aria-hidden /> {label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Gold marquee ticker */}
      <div className="relative border-t border-primary/20 bg-gold text-cocoa">
        <div className="overflow-hidden py-3" aria-hidden>
          <div className="animate-marquee flex w-max whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.22em]">
            {[...MARQUEE, ...MARQUEE].map((t, i) => (
              <span key={i} className="flex items-center">
                <span className="px-6">{t}</span>
                <span className="text-primary">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
