/**
 * Short "About Amaan's" section — warm imagery + story, with a subtle
 * scroll-in and floating badge.
 */
import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Award, Users } from "lucide-react";
import SmartImage from "../ui/SmartImage";

const STATS = [
  { icon: Award, value: "7+ yrs", label: "of daily baking" },
  { icon: Users, value: "12k+", label: "happy customers" },
  { icon: MapPin, value: "Kira", label: "Bulindo, Kampala" },
];

export default function About() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-beige/60 py-20">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="overflow-hidden rounded-3xl shadow-card">
            <SmartImage
              src="images/about-bakery.jpg"
              alt="Fresh artisan loaf cooling on a copper tray at Amaan's Bakery"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 22 }}
            className="absolute -bottom-6 right-6 rounded-2xl bg-primary px-6 py-4 text-cream shadow-card"
          >
            <p className="font-display text-2xl font-extrabold text-gold">Est. 2019</p>
            <p className="text-xs font-bold text-cream/80">Kira Bulindo, Kampala</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold-dark">
            About Amaan’s
          </span>
          <h2 className="font-display text-3xl font-bold text-primary sm:text-4xl">
            A neighborhood oven with a big heart
          </h2>
          <p className="leading-relaxed text-cocoa-light">
            Amaan’s Bakery began with one clay-hot oven in Kira Bulindo and a simple belief:
            bread should taste like someone loves you. Today we bake Ugandan favorites —
            pillowy mandazi, flaky chapati, matooke banana bread — alongside red velvet,
            tiramisu and croissants laminated for three days.
          </p>
          <p className="leading-relaxed text-cocoa-light">
            Every cake that leaves our counter is built to order. Design yours online and we’ll
            bake it like it’s for our own family.
          </p>

          <ul className="grid grid-cols-3 gap-4 pt-2">
            {STATS.map(({ icon: Icon, value, label }) => (
              <li key={label} className="rounded-2xl bg-white p-4 text-center shadow-soft">
                <Icon className="mx-auto h-5 w-5 text-gold-dark" aria-hidden />
                <p className="mt-1 font-display text-lg font-extrabold text-primary">{value}</p>
                <p className="text-[11px] font-bold text-cocoa-light">{label}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
