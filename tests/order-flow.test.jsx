/**
 * End-to-end smoke test of the "Bake Your Own Cake" wizard in jsdom:
 * walks all six steps, checks gating, then submits to the success panel.
 */
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { CartProvider } from "../src/context/CartContext";
import { CustomizeProvider } from "../src/components/customize/CustomizeModal";
import SpecialOrderPage from "../src/pages/SpecialOrderPage";

const FLOW = { timeout: 3000 };

function setup() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <CustomizeProvider>
          <SpecialOrderPage />
        </CustomizeProvider>
      </CartProvider>
    </MemoryRouter>
  );
}

const nextBtn = () => screen.getByRole("button", { name: /Next/ });

describe("Bake Your Own Cake wizard", () => {
  it("walks all six steps and submits", async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getByText("Bake Your Own Cake")).toBeTruthy();

    // Step 1 — Next locked until size + shape chosen
    expect(nextBtn().disabled).toBe(true);
    await user.click(screen.getByRole("radio", { name: /6" Round/ }));
    expect(nextBtn().disabled).toBe(true); // shape still missing
    await user.click(screen.getByRole("radio", { name: /^Round/ }));
    await waitFor(() => expect(nextBtn().disabled).toBe(false));
    await user.click(nextBtn());

    // Step 2 — flavor
    await screen.findByText("Choose your cake flavor", {}, FLOW);
    expect(nextBtn().disabled).toBe(true);
    await user.click(screen.getByRole("radio", { name: /Vanilla/ }));
    await waitFor(() => expect(nextBtn().disabled).toBe(false));
    await user.click(nextBtn());

    // Step 3 — fillings optional (soft)
    await screen.findByText(/Layer in some fillings/, {}, FLOW);
    await user.click(screen.getByRole("checkbox", { name: /Chocolate ganache/ }));
    await waitFor(() => expect(nextBtn().disabled).toBe(false));
    await user.click(nextBtn());

    // Step 4 — frosting optional (soft)
    await screen.findByText(/Choose a frosting/, {}, FLOW);
    await user.click(screen.getByRole("radio", { name: /Vanilla buttercream/ }));
    await user.click(nextBtn());

    // Step 5 — decorations + message (<=100 chars enforced)
    await screen.findByText("Decorations & toppings", {}, FLOW);
    const msg = screen.getByPlaceholderText(/Happy Birthday Aisha/);
    await user.type(msg, "Happy Birthday Aisha");
    await user.click(nextBtn());

    // Step 6 — delivery details & validation
    await screen.findByText("Pickup or delivery?", {}, FLOW);
    expect(screen.getByRole("button", { name: /Submit Special Order/ }).disabled).toBe(true);

    await user.click(screen.getByRole("radio", { name: /Pickup at the bakery/ }));
    await user.type(screen.getByPlaceholderText(/Aisha Namutebi/), "Aisha Namutebi");

    const phone = screen.getByPlaceholderText(/0772 606296 or \+256 772 606296/);
    await user.type(phone, "12345"); // invalid first
    await user.clear(phone);
    await user.type(phone, "0772606296");

    const dateInput = document.getElementById("field-date");
    fireEvent.change(dateInput, { target: { value: "2026-09-20" } });

    const timeSelect = document.getElementById("field-time");
    await user.selectOptions(timeSelect, "8:00 – 10:00 AM");

    await waitFor(
      () => expect(screen.getByRole("button", { name: /Submit Special Order/ }).disabled).toBe(false),
      { timeout: 3000 }
    );
    await user.click(screen.getByRole("button", { name: /Submit Special Order/ }));

    // Success panel
    await screen.findByText(/Order received!/i, {}, { timeout: 5000 });
    expect(screen.getByText(/AB-\d{4}/)).toBeTruthy();
  }, 30000);
});
