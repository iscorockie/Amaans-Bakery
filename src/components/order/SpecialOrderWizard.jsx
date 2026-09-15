/**
 * SpecialOrderWizard — the "Bake Your Own Cake" engine.
 *
 * ONE React Hook Form instance (zodResolver over the combined schema) owns
 * every step, so values persist while navigating. Per-step validation uses
 * `trigger(STEP_FIELDS[step])` on "Next"; the enabled/disabled state of the
 * buttons derives from each step's Zod schema via `safeParse` over `useWatch`
 * values — instant, without spamming errors. `LiveCakeSummary` and the dynamic
 * UGX estimate consume the same watched values.
 *
 * Performance patterns:
 *  - `useWatch` scoped per field inside steps; whole-form watch only in the
 *    summary (its sole consumer).
 *  - memoized presentational primitives (SelectionCard, IngredientChip).
 *  - pure price math memoized with useMemo.
 *  - transform/opacity-only step transitions (AnimatePresence mode="wait").
 */
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";

import {
  specialOrderSchema,
  SPECIAL_ORDER_DEFAULTS,
  STEP_SCHEMAS,
  STEP_FIELDS,
  STEP_TITLES,
} from "../../schemas/specialOrderSchemas";
import { priceSpecialOrder } from "../../lib/pricing";
import { formatUGX } from "../../lib/format";
import StepProgressBar from "./StepProgressBar";
import LiveCakeSummary from "./LiveCakeSummary";
import SuccessPanel from "./SuccessPanel";
import { STEP_COMPONENTS } from "./steps";
import Button from "../ui/Button";

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

/* Draft persistence — an accidental refresh never eats your cake design. */
const DRAFT_KEY = "amaans-bake-your-cake-draft";

function loadDraft() {
  try {
    const raw = typeof sessionStorage !== "undefined" && sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      step: Number.isInteger(parsed.step) ? Math.min(Math.max(parsed.step, 0), LAST) : 0,
      values: { ...SPECIAL_ORDER_DEFAULTS, ...(parsed.values || {}) },
    };
  } catch {
    return null;
  }
}

function saveDraft(payload) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    /* private mode etc. — non-fatal */
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

export default function SpecialOrderWizard() {
  const reduce = useReducedMotion();
  const [initialDraft] = useState(loadDraft);
  const [step, setStep] = useState(initialDraft?.step ?? 0);
  const [direction, setDirection] = useState(1);
  const [shake, setShake] = useState(0);
  const [success, setSuccess] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const formCardRef = useRef(null);
  const firstRender = useRef(true);

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
    defaultValues: initialDraft?.values ?? SPECIAL_ORDER_DEFAULTS,
  });

  const watched = useWatch({ control });

  // Debounced draft autosave
  useEffect(() => {
    const t = setTimeout(() => saveDraft({ step, values: watched }), 250);
    return () => clearTimeout(t);
  }, [watched, step]);

  // Keep the wizard in view when the step changes (matters on mobile)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (typeof formCardRef.current?.scrollIntoView === "function") {
      formCardRef.current.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [step, reduce]);

  /** Instant per-step validity (drives the disabled state of Next/Submit). */
  const stepValid = useMemo(
    () => STEP_SCHEMAS[step].safeParse(pick(watched, STEP_FIELDS[step])).success,
    [watched, step]
  );

  /** Live running quote — powers the sticky mobile estimate bar. */
  const quote = useMemo(() => priceSpecialOrder(watched), [watched]);

  const invalidAttempt = useCallback(() => setShake((s) => s + 1), []);

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
      clearDraft(); // the design became an order — drop the draft
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
    clearDraft();
    reset(SPECIAL_ORDER_DEFAULTS);
    setSuccess(null);
    setStep(0);
    setDirection(1);
  };

  const StepBody = STEP_COMPONENTS[step];

  return (
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
            ref={formCardRef}
            onSubmit={handleSubmit(onSubmit, invalidAttempt)}
            className="card-surface scroll-mt-32 overflow-hidden"
          >
            <div className="border-b border-cocoa/10 bg-cream/60 bg-warm-glow px-6 pb-8 pt-6 sm:px-8">
              <StepProgressBar
                step={step}
                onStepClick={(i) => {
                  setDirection(-1);
                  setStep(i);
                }}
              />
            </div>

            <div className="px-6 py-8 sm:px-8">
              <p className="mb-1 font-display text-2xl font-extrabold text-cocoa">
                {STEP_TITLES[step].title}
              </p>
              <p className="mb-7 text-sm italic text-cocoa-light">{STEP_TITLES[step].caption}</p>

              {/* Draft indicator — isDirty tells us the design is in progress */}
              <AnimatePresence>
                {isDirty && (
                  <motion.p
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-[11px] font-extrabold text-cocoa-light"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-dark" aria-hidden />
                    Draft in progress — your choices are kept as you move between steps
                  </motion.p>
                )}
              </AnimatePresence>

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

              {/* Navigation (remounts on shake to replay invalid feedback) */}
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
          <LiveCakeSummary control={control} />

          {/* Mobile: the summary rail stacks below the form, so keep the
              live price in view at all times on small screens. */}
          <div className="sticky bottom-0 z-30 flex items-center justify-between gap-3 rounded-t-2xl border-t border-gold/30 bg-cream/95 px-5 py-3 shadow-[0_-10px_28px_-14px_rgba(62,39,35,0.45)] backdrop-blur lg:hidden">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-cocoa/60">
              Live estimate
            </span>
            <span
              className="font-display text-xl font-extrabold tabular-nums text-primary"
              aria-live="polite"
            >
              {formatUGX(quote.total)}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
