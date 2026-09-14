/**
 * WhatsApp helpers — orders at Amaan's Bakery are confirmed over WhatsApp,
 * which is how most customers in Kampala prefer to chat.
 */

export const BAKERY = {
  name: "Amaan’s Bakery",
  tagline: "Freshly Baked, Perfectly Tasty",
  location: "Kira Bulindo, Kampala, Uganda",
  whatsappNumbers: [
    { label: "+256 772 606296", digits: "256772606296" },
    { label: "+256 744 850346", digits: "256744850346" },
  ],
  primaryWhatsapp: "256772606296",
};

/**
 * Build a wa.me deep link. `message` is plain text — we handle encoding.
 */
export function whatsAppLink(message, digits = BAKERY.primaryWhatsapp) {
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Shared confirmation copy for an order line-list. */
export function orderToWhatsAppText({ title, lines, total }) {
  const parts = [
    `Hello ${BAKERY.name}! 🍰`,
    `I'd like to place an order:`,
    ``,
    `${title}`,
    ...lines.map((l) => `• ${l}`),
  ];
  if (total) parts.push(``, `Estimated total: ${total}`);
  parts.push(``, `Please confirm availability. Thank you!`);
  return parts.join("\n");
}
