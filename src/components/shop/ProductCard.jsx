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
      className="card-surface group flex flex-col overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden">
        <SmartImage
          src={product.image}
          alt={product.name}
          fallbackLabel={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-primary backdrop-blur">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-snug text-cocoa">{product.name}</h3>
          <span className="whitespace-nowrap rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary tabular-nums">
            {formatUGX(product.price)}
          </span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-cocoa-light">{product.description}</p>
        <button
          onClick={() => onCustomize(product)}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/60 px-4 py-2.5 text-sm font-extrabold text-primary transition-all hover:bg-primary hover:text-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden /> Customize &amp; Order
        </button>
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);
