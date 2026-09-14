/**
 * Product card — image, name, description, UGX price and the
 * "Customize & Order" action. Hover lift + image zoom via transforms only.
 */
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { formatUGX } from "../../lib/format";
import { CATEGORIES } from "../../data/products";
import SmartImage from "../ui/SmartImage";

function ProductCard({ product, onCustomize, index = 0 }) {
  const reduce = useReducedMotion();
  const categoryLabel = CATEGORIES.find((c) => c.id === product.category)?.label ?? product.category;

  return (
    <motion.article
      layout={reduce ? undefined : true}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -6 }}
      className="card-surface group flex flex-col overflow-hidden rounded-3xl ring-1 ring-cocoa/5 transition-shadow duration-300 hover:shadow-card"
    >
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          src={product.image}
          alt={product.name}
          fallbackLabel={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cocoa/50 to-transparent" aria-hidden />
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary backdrop-blur">
          {categoryLabel}
        </span>
        <span className="absolute bottom-3 right-3 rounded-full bg-cream/95 px-3.5 py-1.5 text-xs font-extrabold text-primary shadow-soft backdrop-blur tabular-nums">
          {formatUGX(product.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-cocoa transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-cocoa-light">{product.description}</p>
        <button
          onClick={() => onCustomize(product)}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/60 px-4 py-2.5 text-sm font-extrabold text-primary shadow-soft transition-all hover:border-primary hover:bg-primary hover:text-cream hover:shadow-card focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden /> Customize &amp; Order
        </button>
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);
