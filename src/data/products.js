/**
 * Amaan's Bakery — product catalogue.
 * Prices in Ugandan Shillings (UGX). `featured` items appear on the homepage.
 */

export const CATEGORIES = [
  { id: "cakes", label: "Cakes", blurb: "Celebration & everyday cakes" },
  { id: "pastries", label: "Pastries", blurb: "Buttery, flaky & golden" },
  { id: "snacks", label: "Snacks", blurb: "Little treats, big joy" },
  { id: "local", label: "Local Ugandan Favorites", blurb: "Tastes of home" },
  { id: "international", label: "International Specialties", blurb: "World-class bakes" },
];

export const PRODUCTS = [
  // ------------------------------------------------------------- Cakes
  {
    id: "chocolate-fudge-cake",
    name: "Chocolate Fudge Cake",
    category: "cakes",
    price: 85000,
    image: "images/chocolate-fudge-cake.jpg",
    description: "Triple-layer dark cocoa sponge with silky chocolate fudge frosting.",
    featured: true,
  },
  {
    id: "vanilla-celebration-cake",
    name: "Vanilla Celebration Cake",
    category: "cakes",
    price: 120000,
    image: "images/vanilla-celebration-cake.jpg",
    description: "Cloud-soft vanilla layers, whipped cream frosting and gilded berries.",
    featured: true,
  },
  {
    id: "carrot-spice-cake",
    name: "Carrot & Spice Cake",
    category: "cakes",
    price: 70000,
    image: "images/carrot-cake.jpg",
    description: "Moist carrot sponge with cinnamon, walnuts and cream-cheese frosting.",
  },
  // ---------------------------------------------------------- Pastries
  {
    id: "butter-croissant",
    name: "Butter Croissant",
    category: "pastries",
    price: 8000,
    image: "images/croissants.jpg",
    description: "72-hour laminated dough, shatteringly crisp and deeply golden.",
    featured: true,
  },
  {
    id: "pastry-box",
    name: "Artisan Pastry Box",
    category: "pastries",
    price: 35000,
    image: "images/pastry-scene.jpg",
    description: "A curated box of croissants, mille-feuille and a small sourdough loaf.",
  },
  {
    id: "beef-samosa",
    name: "Beef Samosas (6 pc)",
    category: "pastries",
    price: 9000,
    image: "images/samosas.png",
    description: "Crisp golden triangles stuffed with spiced minced beef & onion.",
  },
  {
    id: "cinnamon-rolls",
    name: "Glazed Cinnamon Rolls (4 pc)",
    category: "pastries",
    price: 12000,
    image: "images/cinnamon-rolls.jpg",
    description: "Pillowy pull-apart swirls dripping with vanilla-bean glaze.",
  },
  // ------------------------------------------------------------ Snacks
  {
    id: "glazed-donut",
    name: "Glazed Doughnut",
    category: "snacks",
    price: 5000,
    image: "images/donuts.jpg",
    description: "Pillowy yeast doughnut dipped in a shiny vanilla glaze.",
  },
  {
    id: "choc-chip-cookie",
    name: "Chocolate Chip Cookie",
    category: "snacks",
    price: 4500,
    image: "images/cookies.jpg",
    description: "Crisp edges, gooey middle, pools of dark chocolate.",
  },
  {
    id: "sprinkle-cupcake",
    name: "Sprinkle Cupcake",
    category: "snacks",
    price: 7000,
    image: "images/cupcakes.jpg",
    description: "Vanilla cupcake crowned with buttercream swirls & rainbow sprinkles.",
  },
  // --------------------------------------------- Local Ugandan Favorites
  {
    id: "mandazi",
    name: "Mandazi (6 pc)",
    category: "local",
    price: 6000,
    image: "images/mandazi.jpg",
    description: "Soft cardamom-kissed fried bread — perfect with chai.",
    featured: true,
  },
  {
    id: "chapati",
    name: "Chapati (4 pc)",
    category: "local",
    price: 4000,
    image: "images/chapati.jpg",
    description: "Flaky, hand-rolled chapatis griddled to golden perfection.",
  },
  {
    id: "passion-fruit-cake",
    name: "Passion Fruit Cake",
    category: "local",
    price: 45000,
    image: "images/passion-fruit-cake.jpg",
    description: "Tangy passion-fruit curd folded through a light sponge.",
  },
  {
    id: "groundnut-cake",
    name: "Groundnut Cake",
    category: "local",
    price: 40000,
    image: "images/groundnut-cake.jpg",
    description: "Roasted groundnut loaf with a creamy peanut heart — pure nostalgia.",
  },
  {
    id: "banana-bread",
    name: "Matooke Banana Bread",
    category: "local",
    price: 25000,
    image: "images/banana-bread.webp",
    description: "Deeply caramelised loaf baked with ripe Ugandan bananas.",
  },
  // ------------------------------------------- International Specialties
  {
    id: "red-velvet",
    name: "Red Velvet Cake",
    category: "international",
    price: 95000,
    image: "images/red-velvet-cake.jpg",
    description: "Velvety crimson layers with tangy cream-cheese frosting.",
    featured: true,
  },
  {
    id: "tiramisu",
    name: "Classic Tiramisu",
    category: "international",
    price: 55000,
    image: "images/tiramisu.jpg",
    description: "Espresso-soaked savoiardi under clouds of mascarpone cream.",
  },
  {
    id: "ny-cheesecake",
    name: "New York Cheesecake",
    category: "international",
    price: 80000,
    image: "images/cheesecake.jpg",
    description: "Dense, silky baked cheesecake with a berry compote crown.",
  },
];

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

export const featuredProducts = () => PRODUCTS.filter((p) => p.featured);
