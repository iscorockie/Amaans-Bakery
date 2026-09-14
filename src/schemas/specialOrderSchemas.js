/**
 * Zod schemas for the "Bake Your Own Cake" multi-step form.
 *
 * Strategy: ONE React Hook Form instance holds the whole order. Each step has
 * its own schema (for per-step `safeParse` => "Next" enabled/disabled) while a
 * single combined schema is handed to `zodResolver` so `trigger(fields)` and
 * the final submit validate exactly the fields they should.
 */
import { z } from "zod";
import { tomorrowISO } from "../lib/format";

/* ------------------------------------------------------------------ */
/* Reusable field-level refinements                                    */
/* ------------------------------------------------------------------ */

/** Ugandan mobile: starts with +256 7… or 07…, 9 digits after the prefix. */
const isUgandanPhone = (raw) => {
  const s = String(raw || "").replace(/[\s()-]/g, "");
  return /^(\+256|0)7\d{8}$/.test(s);
};

/** Bakery needs ≥1 day of notice — the chosen date must be tomorrow or later. */
const isFutureDate = (v) => Boolean(v) && v >= tomorrowISO();

/* ------------------------------------------------------------------ */
/* Field definitions (shared by step schemas and the combined schema)  */
/* ------------------------------------------------------------------ */

const F = {
  // Step 1 — Size & shape (both required)
  size: z.string().min(1, "Please choose a cake size."),
  shape: z.string().min(1, "Please pick a shape you love."),

  // Step 2 — Flavor (required); custom flavor asks for details
  flavor: z.string().min(1, "Every great cake starts with a flavor."),
  customFlavor: z.string().max(60, "Keep it under 60 characters."),

  // Step 3 — Fillings (soft encouragement, never a hard block)
  fillings: z.array(z.string()).max(6, "Up to 6 fillings keeps the bake balanced."),

  // Step 4 — Frosting (optional; we gently nudge if skipped)
  frosting: z.string(),

  // Step 5 — Decorations + message on the cake
  decorations: z.array(z.string()).max(12, "Let's keep it elegant — 12 decorations max."),
  customMessage: z.string().max(100, "Please keep your message under 100 characters."),

  // Step 6 — Delivery / pickup & contact
  method: z
    .string()
    .min(1, "Choose pickup or delivery.")
    .refine((v) => ["pickup", "delivery"].includes(v), "Choose pickup or delivery."),
  name: z.string().min(2, "Please tell us your name."),
  phone: z
    .string()
    .min(1, "We need a number to confirm your bake.")
    .refine(isUgandanPhone, "Use a Ugandan format, e.g. 0772 606296 or +256 772 606296."),
  address: z.string().max(200, "Keep the address under 200 characters."),
  date: z
    .string()
    .min(1, "Pick the day you need your cake.")
    .refine(isFutureDate, "We need at least one day to bake — please choose a future date."),
  time: z.string().min(1, "Choose a time slot."),
  notes: z.string().max(500, "Keep notes under 500 characters."),
};

/* ------------------------------------------------------------------ */
/* Per-step schemas — used for the "Next" button's enabled state       */
/* ------------------------------------------------------------------ */

export const step1Schema = z.object({ size: F.size, shape: F.shape });

export const step2Schema = z
  .object({ flavor: F.flavor, customFlavor: F.customFlavor })
  .superRefine((v, ctx) => {
    if (v.flavor === "custom" && v.customFlavor.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customFlavor"],
        message: "Tell the chef your dream flavor (at least 3 characters).",
      });
    }
  });

export const step3Schema = z.object({ fillings: F.fillings });
export const step4Schema = z.object({ frosting: F.frosting });
export const step5Schema = z.object({ decorations: F.decorations, customMessage: F.customMessage });

export const step6Schema = z
  .object({
    method: F.method,
    name: F.name,
    phone: F.phone,
    address: F.address,
    date: F.date,
    time: F.time,
    notes: F.notes,
  })
  .superRefine((v, ctx) => {
    if (v.method === "delivery" && v.address.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Add a delivery address so our rider can find you.",
      });
    }
  });

/* ------------------------------------------------------------------ */
/* Combined schema — handed to zodResolver                             */
/* ------------------------------------------------------------------ */

export const specialOrderSchema = z
  .object({ ...F })
  .superRefine((v, ctx) => {
    if (v.flavor === "custom" && v.customFlavor.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["customFlavor"],
        message: "Tell the chef your dream flavor (at least 3 characters).",
      });
    }
    if (v.method === "delivery" && v.address.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Add a delivery address so our rider can find you.",
      });
    }
  });

/* ------------------------------------------------------------------ */
/* Step metadata — field lists for trigger() & schema lookup           */
/* ------------------------------------------------------------------ */

export const STEP_SCHEMAS = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
];

export const STEP_FIELDS = [
  ["size", "shape"],
  ["flavor", "customFlavor"],
  ["fillings"],
  ["frosting"],
  ["decorations", "customMessage"],
  ["method", "name", "phone", "address", "date", "time", "notes"],
];

export const STEP_TITLES = [
  { title: "Size & Shape", caption: "How grand shall we go?" },
  { title: "Cake Flavor", caption: "The soul of your cake" },
  { title: "Fillings", caption: "Secret layers of joy" },
  { title: "Frosting", caption: "The finishing coat" },
  { title: "Decorations", caption: "Make it unmistakably yours" },
  { title: "Delivery Details", caption: "When & where shall it arrive?" },
];

/** Complete default values — keep `isDirty` meaningful and steps persistent. */
export const SPECIAL_ORDER_DEFAULTS = {
  size: "",
  shape: "",
  flavor: "",
  customFlavor: "",
  fillings: [],
  frosting: "",
  decorations: [],
  customMessage: "",
  method: "",
  name: "",
  phone: "",
  address: "",
  date: "",
  time: "",
  notes: "",
};
