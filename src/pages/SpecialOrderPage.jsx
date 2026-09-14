/**
 * "Special Order – Bake Your Own Cake" page — header + wizard.
 */
import { CakeSlice } from "lucide-react";
import SpecialOrderWizard from "../components/order/SpecialOrderWizard";

export default function SpecialOrderPage() {
  return (
    <div className="container-x py-14">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-gold-dark">
          Special order
        </span>
        <h1 className="mt-2 font-display text-4xl font-extrabold text-primary sm:text-5xl">
          Bake Your Own Cake
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa-light sm:text-base">
          Six delicious steps between you and the cake of your dreams — watch your creation and
          its price come together live on the right.
        </p>
      </div>

      <SpecialOrderWizard />

      <p className="mt-12 flex items-center justify-center gap-2 text-center text-xs font-bold text-cocoa/50">
        <CakeSlice className="h-4 w-4 text-gold-dark" aria-hidden />
        Every special cake is baked fresh for its day — never from the freezer.
      </p>
    </div>
  );
}
