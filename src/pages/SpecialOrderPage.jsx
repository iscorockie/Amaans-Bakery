/**
 * "Special Order – Bake Your Own Cake".
 *
 * ONE React Hook Form instance (zodResolver over the combined schema) owns
 * every step, so values persist while navigating. Per-step validation uses
 * `trigger(STEP_FIELDS[step])` on "Next", while the enabled/disabled state of
 * the buttons is derived from each step's Zod schema via `safeParse` over
 * `useWatch` values — instant, without spamming errors. The live summary card
 * and the dynamic price estimate consume the same watched values.
 */
import { useMemo, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Send, CakeSlice } from "lucide-react";

import {
  specialOrderSchema,
  SPECIAL_ORDER_DEFAULTS,
  STEP_SCHEMAS,
  STEP_FIELDS,
  STEP_TITLES,
} from "../schemas/specialOrderSchemas";
import { priceSpecialOrder } from "../lib/pricing";
import ProgressBar from "../components/order/ProgressBar";
import SummaryCard from "../components/order/SummaryCard";
import SuccessPanel from "../components/order/SuccessPanel";
import { STEP_COMPONENTS } from "../components/order/steps";
import Button from "../components/ui/Button";

const LAST = STEP_TITLES.length - 1;
const EASE = [0.22, 1, 0.36, 1];

/** Direction-aware slide variants (transform/opacity only). */
const stepVariants = {
  enter: (dir) => (dir >= 0 ? { opacity: 0, x: 56 } : { opacity: 0, x: -56 }),
  center: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 320, damping: 32 } },
  exit: (dir) => (dir >= 0
    ? { opacity: 0, x: -56, transition: { duration: 0.22, ease: EASE } }
    : { opacity: 0, x: 56, transition: { duration: 0.22, ease: EASE } }),
};

const pick = (obj, keys) => Object.fromEntries(keys.map((k) => [k, obj[k]]));

export default function SpecialOrderPage() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [shake, setShake] = useState(0);
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const {
    control,
    register,
    trigger,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(specialOrderSchema),
    mode: "onChange", // live re-validation: errors clear as the user corrects
    defaultValues: SPECIAL_ORDER_DEFAULTS,
  });

  const watched = useWatch({ control });

  /** Instant per-step validity (drives the disabled state of Next/Submit). */
  const stepValid = useMemo(
    () => STEP_SCHEMAS[step].safeParse(pick(watched, STEP_FIELDS[step])).success,
    [watched, step]
  );

  const invalidAttempt = useCallback(() => {
    setShake((s) => s + 1);
  }, []);

  const goNext = async () => {
    const ok = await trigger(STEP_FIELDS[step]); // validate only this step
    if (!ok) return invalidAttempt();
    setDirection(1);
    setStep((s) => Math.min(s + 1, LAST));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  /** Final submit — guarded against double submission by isSubmitting. */
  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      await new Promise((r) => setTimeout(r, 1100)); // chef checks the oven 🧑🏾‍🍳
      const { total } = priceSpecialOrder(values);
      setSuccess({
        code: `AB-${Math.floor(1000 + Math.random() * 9000)}`,
        values,
        total,
      });
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } catch {
      setSubmitError("Something went wrong sending your order. Please try again or WhatsApp us directly.");
    }
  };

  const startOver = () => {
    reset(SPECIAL_ORDER_DEFAULTS);
    setSuccess(null);
    setStep(0);
    setDirection(1);
  };

  const StepBody = STEP_COMPONENTS[step];

  return (
    <div className="container-x py-14">
      {/* Header */}
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
        {/* Draft indicator — isDirty tells us the design is in progress */}
        <AnimatePresence>
          {isDirty && !success && (
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0 }}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-[11px] font-extrabold text-cocoa-light"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold-dark" aria-hidden />
              Draft in progress — your choices are kept as you move between steps
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {success ? (
          <SuccessPanel key="success" order={success} onReset={startOver} />
        ) : (
          <motion.div
            key="form"
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            className="grid items-start gap-8 lg:grid-cols-[1fr_360px]"
          >
            {/* Form card */}
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit, invalidAttempt)}
              className="card-surface overflow-hidden"
            >
              <div className="border-b border-cocoa/10 bg-white px-6 pb-8 pt-6 sm:px-8">
                <ProgressBar step={step} />
              </div>

              <div className="px-6 py-8 sm:px-8">
                <motion.p key={`title-${step}`} initial={false} animate={{ opacity: 1 }} className="mb-1 font-display text-2xl font-extrabold text-cocoa">
                  {STEP_TITLES[step].title}
                </motion.p>
                <p className="mb-7 text-sm italic text-cocoa-light">{STEP_TITLES[step].caption}</p>

                {/* Animated step body */}
                <div className="min-h-[320px]">
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={reduce ? { enter: {}, center: {}, exit: {} } : stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      <StepBody control={control} register={register} errors={errors} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Submit error banner */}
                <AnimatePresence>
                  {submitError && (
                    <motion.p
                      role="alert"
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      className="mt-6 rounded-xl bg-danger-soft px-4 py-3 text-sm font-bold text-danger"
                    >
                      {submitError}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Navigation */}
                <motion.div
                  key={`nav-${shake}`}
                  initial={{ x: 0 }}
                  animate={shake > 0 && !reduce ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8 flex items-center justify-between gap-4"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={step === 0 || isSubmitting}
                    className={step === 0 ? "invisible" : ""}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                  </Button>

                  {/* Wrap Next/Submit so a click while disabled still gives feedback */}
                  <div onClick={() => (!stepValid || !isValid) && !isSubmitting && invalidAttempt()}>
                    {step < LAST ? (
                      <Button
                        type="button"
                        size="lg"
                        onClick={goNext}
                        disabled={!stepValid || isSubmitting}
                        className="disabled:pointer-events-none"
                        aria-disabled={!stepValid}
                      >
                        Next <ArrowRight className="h-5 w-5" aria-hidden />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        size="lg"
                        variant="gold"
                        loading={isSubmitting}
                        disabled={!stepValid || !isValid}
                        className="disabled:pointer-events-none"
                        aria-disabled={!stepValid || !isValid}
                      >
                        {!isSubmitting && <Send className="h-5 w-5" aria-hidden />}
                        {isSubmitting ? "Sending to the kitchen…" : "Submit Special Order"}
                      </Button>
                    )}
                  </div>
                </motion.div>

                {!stepValid && (
                  <p className="mt-3 text-right text-[11px] font-bold text-cocoa/50">
                    Complete this step to continue — we’ll nudge you if anything’s missing.
                  </p>
                )}
              </div>
            </form>

            {/* Live summary */}
            <SummaryCard control={control} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative strip */}
      {!success && (
        <p className="mt-12 flex items-center justify-center gap-2 text-center text-xs font-bold text-cocoa/50">
          <CakeSlice className="h-4 w-4 text-gold-dark" aria-hidden />
          Every special cake is baked fresh for its day — never from the freezer.
        </p>
      )}
    </div>
  );
}
