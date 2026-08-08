import type { Metadata } from "next";

import { DeviceGatePattern } from "../../../components/device-gate-pattern";

export const metadata: Metadata = {
  title: "Dark device gate | Allfit One Design System",
  description: "Dark compact-device gate for Allfit One web products.",
};

export default function DarkDeviceGatePatternPage() {
  return <DeviceGatePattern product="Backoffice" theme="dark" />;
}
