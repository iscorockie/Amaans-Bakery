/**
 * Smoke tests: home page, shop filter, customize modal & cart drawer.
 */
import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { CartProvider } from "../src/context/CartContext";
import { CustomizeProvider } from "../src/components/customize/CustomizeModal";
import CartDrawer from "../src/components/layout/CartDrawer";
import HomePage from "../src/pages/HomePage";
import ShopPage from "../src/pages/ShopPage";

function setup(ui) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CustomizeProvider>
          {ui}
          <CartDrawer />
        </CustomizeProvider>
      </CartProvider>
    </MemoryRouter>
  );
}

describe("Storefront", () => {
  it("renders home with hero, featured and CTAs", async () => {
    setup(<HomePage />);
    expect(screen.getByText("Freshly Baked,")).toBeTruthy();
    expect(screen.getAllByText(/Shop Now/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Bakes Everyone Talks About/)).toBeTruthy();
  });

  it("filters shop categories", async () => {
    const user = userEvent.setup();
    setup(<ShopPage />);
    expect(screen.getByText("Chocolate Fudge Cake")).toBeTruthy();
    await user.click(screen.getByRole("tab", { name: "Local Ugandan Favorites" }));
    await screen.findByText("Mandazi (6 pc)");
    expect(screen.queryByText("Chocolate Fudge Cake")).toBeNull();
  });

  it("customizes a product and adds it to the cart", async () => {
    const user = userEvent.setup();
    setup(<ShopPage />);

    await user.click(screen.getAllByRole("button", { name: /Customize & Order/ })[0]);
    await screen.findByText("Your bake so far");

    // tick an ingredient -> chip appears in live summary
    await user.click(screen.getByRole("checkbox", { name: /Chocolate ganache/ }));
    await screen.findByText(/1× Chocolate ganache/);

    // add to cart -> drawer opens with the item
    await user.click(screen.getByRole("button", { name: /Add to Cart/ }));
    await screen.findByText("Your Basket");
    await screen.findByText(/Confirm order on WhatsApp/);
  }, 15000);
});
