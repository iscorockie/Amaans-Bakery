/**
 * Homepage — hero, featured bakes, about, and the special-order banner.
 */
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CakeSlice, ArrowRight, MessageCircle } from "lucide-react";
import Hero from "../components/home/Hero";
import Featured from "../components/home/Featured";
import About from "../components/home/About";
import { useCustomize } from "../components/customize/CustomizeModal";
import { BAKERY, whatsAppLink } from "../lib/whatsapp";

export default function HomePage() {
  const { open } = useCustomize();
  const reduce = useReducedMotion();

  return (
    <>
      <Hero />
      <Featured onCustomize={open} />
      <About />

      {/* Special order banner */}
      <section className="container-x pt-20">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center shadow-card sm:px-14"
        >
          <div className="pointer-events-none absolute inset-0 bg-warm-glow opacity-30" aria-hidden />
          <CakeSlice className="mx-auto h-10 w-10 text-gold" aria-hidden />
          <h2 className="mt-4 font-display text-3xl font-extrabold text-cream sm:text-4xl">
            Dream it. We’ll bake it.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-cream/85 sm:text-base">
            Design your own cake in six delicious steps — size, flavor, fillings, frosting,
            decorations and delivery — with a live price estimate as you go.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/order">
              <motion.span whileHover={reduce ? undefined : { scale: 1.03 }} className="block">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-extrabold text-cocoa shadow-card">
                  Special Order – Bake Your Cake <ArrowRight className="h-5 w-5" aria-hidden />
                </span>
              </motion.span>
            </Link>
            <a
              href={whatsAppLink(`Hello ${BAKERY.name}! I have a question about a special order.`)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-cream/60 px-7 py-3.5 text-base font-extrabold text-cream transition-colors hover:bg-cream hover:text-primary"
            >
              <MessageCircle className="h-5 w-5" aria-hidden /> Ask on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
