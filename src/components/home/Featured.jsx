/**
 * Homepage featured grid — a taste of the menu with the same
 * Customize & Order flow as the shop.
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { featuredProducts } from "../../data/products";
import SectionHeading from "../ui/SectionHeading";
import ProductCard from "../shop/ProductCard";

export default function Featured({ onCustomize }) {
  return (
    <section className="container-x py-20">
      <div className="mb-10 flex flex-col items-center gap-6">
        <SectionHeading
          overline="This week’s oven highlights"
          title="Bakes Everyone Talks About"
          sub="A little preview of the counter — every item can be customized with your favorite fillings, toppings and frostings."
        />
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-extrabold text-primary underline decoration-gold decoration-2 underline-offset-4 hover:text-primary-700"
        >
          View the full menu <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProducts().map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} onCustomize={onCustomize} />
        ))}
      </div>
    </section>
  );
}
