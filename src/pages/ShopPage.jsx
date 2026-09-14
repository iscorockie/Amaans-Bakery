/**
 * Shop / Menu — category filter tabs (layoutId pill) + animated product grid.
 */
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "../components/shop/ProductCard";
import { useCustomize } from "../components/customize/CustomizeModal";
import SectionHeading from "../components/ui/SectionHeading";

export default function ShopPage() {
  const { open } = useCustomize();
  const [cat, setCat] = useState("all");
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat]
  );

  return (
    <div className="container-x py-14">
      <SectionHeading
        overline="The menu"
        title="Shop the Bakery"
        sub="Ugandan favorites and international specialties — every bake can be customized with fillings, toppings, fruits, nuts, spices and frostings."
      />

      {/* Category tabs */}
      <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Product categories">
        {[{ id: "all", label: "All Bakes" }, ...CATEGORIES].map((c) => {
          const active = cat === c.id;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => setCat(c.id)}
              className={[
                "relative rounded-full px-5 py-2.5 text-sm font-extrabold transition-colors",
                active ? "text-cream" : "text-cocoa-light hover:bg-primary/10 hover:text-primary",
              ].join(" ")}
            >
              {active && (
                <motion.span
                  layoutId="cat-pill"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  className="absolute inset-0 rounded-full bg-primary shadow-card shadow-primary/30"
                  aria-hidden
                />
              )}
              <span className="relative z-10">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onCustomize={open} />
        ))}
      </motion.div>
    </div>
  );
}
