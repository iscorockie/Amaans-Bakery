/**
 * Shared option catalogs & pricing for BOTH the "Customize & Order" modal and
 * the "Bake Your Own Cake" special-order flow. All prices in UGX.
 */

/* ------------------------------------------------------------------ */
/* Ingredient groups — used by the product customization flow          */
/* ------------------------------------------------------------------ */

export const INGREDIENT_GROUPS = [
  {
    id: "fillings",
    label: "Fillings",
    hint: "Layered inside the bake",
    items: [
      { id: "choc-ganache", label: "Chocolate ganache", price: 15000 },
      { id: "strawberry-compote", label: "Strawberry compote", price: 12000 },
      { id: "passion-curd", label: "Passion fruit curd", price: 12000 },
      { id: "salted-caramel", label: "Salted caramel", price: 14000 },
      { id: "vanilla-custard", label: "Vanilla custard", price: 10000 },
      { id: "cream-cheese-fill", label: "Cream cheese", price: 12000 },
      { id: "groundnut-butter", label: "Roasted groundnut butter", price: 10000 },
    ],
  },
  {
    id: "toppings",
    label: "Toppings",
    hint: "Crowning touches",
    items: [
      { id: "choc-shards", label: "Chocolate shards", price: 8000 },
      { id: "gold-dust", label: "Edible gold dust", price: 10000 },
      { id: "sprinkles", label: "Rainbow sprinkles", price: 5000 },
      { id: "edible-flowers", label: "Edible flowers", price: 12000 },
      { id: "caramel-drizzle", label: "Caramel drizzle", price: 6000 },
    ],
  },
  {
    id: "fruits",
    label: "Fruits",
    hint: "Fresh & seasonal",
    items: [
      { id: "strawberries", label: "Fresh strawberries", price: 10000 },
      { id: "passion-fruit", label: "Passion fruit", price: 8000 },
      { id: "banana", label: "Caramelised banana", price: 6000 },
      { id: "mango", label: "Ripe mango", price: 8000 },
      { id: "pineapple", label: "Pineapple", price: 6000 },
    ],
  },
  {
    id: "nuts",
    label: "Nuts",
    hint: "Toasted in-house",
    items: [
      { id: "groundnuts", label: "Toasted groundnuts", price: 5000 },
      { id: "walnuts", label: "Walnuts", price: 8000 },
      { id: "almonds", label: "Almonds", price: 9000 },
      { id: "cashews", label: "Cashews", price: 10000 },
    ],
  },
  {
    id: "spices",
    label: "Spices",
    hint: "A whisper of warmth",
    items: [
      { id: "cinnamon", label: "Cinnamon", price: 3000 },
      { id: "cardamom", label: "Cardamom", price: 4000 },
      { id: "nutmeg", label: "Nutmeg", price: 3000 },
      { id: "vanilla-bean", label: "Real vanilla bean", price: 6000 },
    ],
  },
  {
    id: "frostings",
    label: "Frostings",
    hint: "The finishing coat",
    items: [
      { id: "vanilla-buttercream", label: "Vanilla buttercream", price: 15000 },
      { id: "choc-buttercream", label: "Chocolate buttercream", price: 15000 },
      { id: "cream-cheese-frost", label: "Cream cheese frosting", price: 18000 },
      { id: "whipped-cream", label: "Whipped cream", price: 12000 },
      { id: "fondant", label: "Fondant finish", price: 35000 },
    ],
  },
  {
    id: "special",
    label: "Special Requests",
    hint: "Make it unforgettable",
    items: [
      { id: "message-plaque", label: "Custom message plaque", price: 5000 },
      { id: "candles-topper", label: "Candles & topper pack", price: 8000 },
      { id: "gift-box", label: "Premium gift box", price: 10000 },
      { id: "photo-topper", label: "Photo-print topper", price: 25000 },
    ],
  },
];

export const ALL_INGREDIENTS = INGREDIENT_GROUPS.flatMap((g) =>
  g.items.map((i) => ({ ...i, group: g.id, groupLabel: g.label }))
);

export const findIngredient = (id) => ALL_INGREDIENTS.find((i) => i.id === id);

/* ------------------------------------------------------------------ */
/* Special order ("Bake Your Own Cake") options                        */
/* ------------------------------------------------------------------ */

export const CAKE_SIZES = [
  { id: '6"', label: '6" Round', serves: "6–8 slices", price: 60000 },
  { id: '8"', label: '8" Round', serves: "12–15 slices", price: 90000 },
  { id: '10"', label: '10" Round', serves: "20–25 slices", price: 140000 },
  { id: "tiered", label: "Two-Tier", serves: "35–45 slices", price: 220000 },
];

export const CAKE_SHAPES = [
  { id: "round", label: "Round", price: 0 },
  { id: "square", label: "Square", price: 5000 },
  { id: "heart", label: "Heart", price: 8000 },
  { id: "number", label: "Number Cake", price: 15000 },
  { id: "custom", label: "Custom Shape", price: 20000 },
];

export const CAKE_FLAVORS = [
  { id: "vanilla", label: "Vanilla", price: 0, note: "Madagascan & mellow" },
  { id: "chocolate", label: "Chocolate", price: 0, note: "Deep & dark cocoa" },
  { id: "red-velvet", label: "Red Velvet", price: 10000, note: "Silky crimson crumb" },
  { id: "carrot", label: "Carrot", price: 8000, note: "Spiced & wholesome" },
  { id: "lemon", label: "Lemon", price: 6000, note: "Zesty & bright" },
  { id: "banana", label: "Banana", price: 5000, note: "Sweet matooke richness" },
  { id: "passion", label: "Passion Fruit", price: 8000, note: "Tangy Ugandan gold" },
  { id: "custom", label: "Custom", price: 10000, note: "Tell us your dream" },
];

/** Fillings & frostings for the special-order flow reuse the ingredient groups. */
export const SPECIAL_FILLINGS = INGREDIENT_GROUPS.find((g) => g.id === "fillings").items;
export const SPECIAL_FROSTINGS = [
  { id: "none", label: "Naked / no frosting", price: 0 },
  ...INGREDIENT_GROUPS.find((g) => g.id === "frostings").items,
];

export const SPECIAL_DECORATIONS = [
  ...INGREDIENT_GROUPS.find((g) => g.id === "toppings").items,
  ...INGREDIENT_GROUPS.find((g) => g.id === "fruits").items,
  { id: "piped-name", label: "Piped name in icing", price: 5000 },
];

export const DELIVERY_METHODS = [
  { id: "pickup", label: "Pickup at the bakery", price: 0, note: "Kira Bulindo, Kampala" },
  { id: "delivery", label: "Delivery", price: 10000, note: "Within Kampala · flat fee" },
];

export const TIME_SLOTS = [
  "8:00 – 10:00 AM",
  "10:00 – 12:00 PM",
  "12:00 – 2:00 PM",
  "2:00 – 4:00 PM",
  "4:00 – 6:00 PM",
];

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

const inList = (list) => (id) => list.find((o) => o.id === id);

export const findSize = inList(CAKE_SIZES);
export const findShape = inList(CAKE_SHAPES);
export const findFlavor = inList(CAKE_FLAVORS);
export const findFrosting = inList(SPECIAL_FROSTINGS);
export const findDecoration = inList(SPECIAL_DECORATIONS);
export const findMethod = inList(DELIVERY_METHODS);
