import { cleanup, render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";

import {
  DeviceGate,
  DeviceGateActions,
  DeviceGateDescription,
  DeviceGateFallback,
  DeviceGateMain,
  DeviceGateTitle,
} from "../src/components/device-gate.js";

afterEach(cleanup);

describe("DeviceGate", () => {
  it("composes product-owned recovery actions and forwards native props", () => {
    render(
      <DeviceGate>
        <DeviceGateFallback>
          <DeviceGateMain aria-labelledby="device-title">
            <DeviceGateTitle id="device-title">Continue on a larger screen</DeviceGateTitle>
            <DeviceGateActions className="product-actions" data-product="studio">
              <button type="button">Copy workspace link</button>
            </DeviceGateActions>
          </DeviceGateMain>
        </DeviceGateFallback>
      </DeviceGate>,
    );

    const actions = screen.getByText("Copy workspace link").parentElement;
    expect(actions).toHaveAttribute("data-slot", "device-gate-actions");
    expect(actions).toHaveAttribute("data-product", "studio");
    expect(actions).toHaveClass("product-actions");
  });

  it("keeps the named main outside another landmark", async () => {
    const { container } = render(
      <DeviceGate>
        <DeviceGateFallback data-testid="fallback">
          <DeviceGateMain aria-labelledby="device-title-a11y">
            <DeviceGateTitle id="device-title-a11y">Continue on desktop</DeviceGateTitle>
            <DeviceGateDescription>This workspace needs more room.</DeviceGateDescription>
            <DeviceGateActions>
              <button type="button">Copy link</button>
            </DeviceGateActions>
          </DeviceGateMain>
        </DeviceGateFallback>
      </DeviceGate>,
    );

    expect(within(container).getByRole("main", { name: "Continue on desktop" })).toBeInTheDocument();
    expect(within(container).getByTestId("fallback")).not.toHaveAttribute("aria-label");
    expect(within(container).getByTestId("fallback")).not.toHaveAttribute("aria-labelledby");
    expect(await axe(container)).toHaveNoViolations();
  });
});
