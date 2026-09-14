/**
 * Zod schema for the product "Customize & Order" modal.
 *
 * `adds` is a map of ingredientId -> quantity (1..20). Ingredients that are
 * unchecked are simply absent from the map.
 */
import { z } from "zod";

export const customizationSchema = z.object({
  adds: z
    .record(z.number({ invalid_type_error: "Quantity must be a number." }).int().min(1).max(20, "Max 20 per ingredient.")),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number." })
    .int("Whole items only.")
    .min(1, "At least one, please.")
    .max(50, "Max 50 per order — call us for bigger events."),
  notes: z.string().max(300, "Please keep notes under 300 characters."),
});

export const CUSTOMIZATION_DEFAULTS = {
  adds: {},
  quantity: 1,
  notes: "",
};
