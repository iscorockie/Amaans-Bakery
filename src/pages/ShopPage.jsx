/**
 * Shop / Menu — memoized CategoryFilter (layoutId pill) + animated grid.
 */
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, PRODUCTS } from "../data/products";
import ProductCard from "../components/shop/ProductCard";
import CategoryFilter from "../components/shop/CategoryFilter";
import { useCustomize } from "../components/customize/CustomizeModal";
import SectionHeading from "../components/ui/SectionHeading";

const TABS = [{ id: "all", label: "All Bakes" }, ...CATEGORIES];

export default function ShopPage() {
  const { open } = useCustomize();
  const [cat, setCat] = useState("all");

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

      <div className="mt-10">
        <CategoryFilter categories={TABS} active={cat} onChange={setCat} />
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onCustomize={open} />
        ))}
      </motion.div>
    </div>
  );
}
