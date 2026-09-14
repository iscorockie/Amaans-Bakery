/**
 * Footer — contact, WhatsApp actions and location for Amaan's Bakery.
 */
import { Link } from "react-router-dom";
import { MapPin, Clock, MessageCircle, Cake, Phone } from "lucide-react";
import { BAKERY, whatsAppLink } from "../../lib/whatsapp";

export default function Footer() {
  return (
    <footer className="mt-20 bg-primary text-cream">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-cream/10">
              <Cake className="h-5 w-5 text-gold" aria-hidden />
            </span>
            <span className="font-display text-xl font-extrabold">Amaan’s Bakery</span>
          </div>
          <p className="text-sm leading-relaxed text-cream/80">
            {BAKERY.tagline}. Small-batch bakes with Ugandan heart — from matooke banana bread to
            red velvet, every crumb is made with love in Kira Bulindo.
          </p>
          <p className="flex items-center gap-2 text-sm font-semibold text-gold">
            <MapPin className="h-4 w-4" aria-hidden /> {BAKERY.location}
          </p>
          <p className="flex items-center gap-2 text-sm text-cream/80">
            <Clock className="h-4 w-4" aria-hidden /> Mon – Sat · 7:00 AM – 7:00 PM
          </p>
        </div>

        {/* Explore */}
        <nav className="space-y-3" aria-label="Footer">
          <h3 className="font-display text-lg font-bold text-gold">Explore</h3>
          <ul className="space-y-2 text-sm font-semibold text-cream/85">
            <li><Link className="hover:text-gold transition-colors" to="/">Home</Link></li>
            <li><Link className="hover:text-gold transition-colors" to="/shop">Shop the Menu</Link></li>
            <li><Link className="hover:text-gold transition-colors" to="/order">Bake Your Own Cake</Link></li>
          </ul>
        </nav>

        {/* Contact */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-bold text-gold">Order on WhatsApp</h3>
          <p className="text-sm text-cream/80">
            Fastest way to order — say hello and we start preheating.
          </p>
          <div className="flex flex-col gap-2">
            {BAKERY.whatsappNumbers.map((n) => (
              <a
                key={n.digits}
                href={whatsAppLink(`Hello ${BAKERY.name}! I'd like to place an order.`, n.digits)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-4 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-[#1FAF57]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                {n.label}
              </a>
            ))}
            <p className="flex items-center gap-2 pt-1 text-xs text-cream/60">
              <Phone className="h-3.5 w-3.5" aria-hidden /> Calls welcome during bakery hours
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} {BAKERY.name} · {BAKERY.location} · Freshly Baked, Perfectly Tasty
      </div>
    </footer>
  );
}
