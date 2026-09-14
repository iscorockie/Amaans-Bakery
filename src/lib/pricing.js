/**
 * Pure price calculators — consumed by the live summary cards so the
 * estimate recalculates on every keystroke / selection.
 */
import {
  findIngredient,
  findSize,
  findShape,
  findFlavor,
  findFrosting,
  findDecoration,
  findMethod,
} from "../data/orderOptions";

/**
 * Price for a customized catalogue product.
 * @param {object} product  catalogue product (has .price)
 * @param {Record<string, number>} adds  ingredientId -> quantity
 * @returns {{ unit: number, lines: Array<{id,label,qty,amount}> }}
 */
export function priceCustomization(product, adds = {}) {
  const lines = Object.entries(adds)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const ing = findIngredient(id);
      if (!ing) return null;
      return { id, label: ing.label, qty, amount: ing.price * qty };
    })
    .filter(Boolean);

  const extras = lines.reduce((sum, l) => sum + l.amount, 0);
  return { unit: product.price + extras, lines };
}

/**
 * Dynamic quote for the "Bake Your Own Cake" special order.
 * @param {object} v  the watched form values
 */
export function priceSpecialOrder(v) {
  const lines = [];
  const push = (label, amount) => {
    if (amount > 0) lines.push({ label, amount });
  };

  const size = v.size ? findSize(v.size) : null;
  if (size) push(`${size.label} base cake`, size.price);

  const shape = v.shape ? findShape(v.shape) : null;
  if (shape) push(`${shape.label} shape`, shape.price);

  const flavor = v.flavor ? findFlavor(v.flavor) : null;
  if (flavor) push(`${flavor.label} flavor`, flavor.price);

  (v.fillings || []).forEach((id) => {
    const f = findIngredient(id);
    if (f) push(`${f.label} filling`, f.price);
  });

  if (v.frosting) {
    const f = findFrosting(v.frosting);
    if (f) push(f.id === "none" ? "Naked finish" : `${f.label} frosting`, f.price);
  }

  (v.decorations || []).forEach((id) => {
    const d = findDecoration(id);
    if (d) push(d.label, d.price);
  });

  const method = v.method ? findMethod(v.method) : null;
  if (method) push(method.label, method.price);

  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  return { total, lines };
}
