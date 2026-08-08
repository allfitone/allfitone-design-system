import type { Metadata } from "next";

import { DeviceGatePattern } from "../../../components/device-gate-pattern";

export const metadata: Metadata = {
  title: "Device gate | Allfit One Design System",
  description: "Compact-device gate for Allfit One web products.",
};

export default function DeviceGatePatternPage() {
  return <DeviceGatePattern product="Studio" theme="light" />;
}
