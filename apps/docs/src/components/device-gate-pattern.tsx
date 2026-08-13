"use client";

import { useRef, useState } from "react";

import { BrandLockup } from "@allfitone/react/brand";
import { Badge } from "@allfitone/react/components/badge";
import { Button } from "@allfitone/react/components/button";
import {
  DeviceGate,
  DeviceGateActions,
  DeviceGateContent,
  DeviceGateDescription,
  DeviceGateEyebrow,
  DeviceGateFallback,
  DeviceGateHeader,
  DeviceGateMain,
  DeviceGateTitle,
  DeviceGateVisual,
} from "@allfitone/react/components/device-gate";
import { Input } from "@allfitone/react/components/input";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@allfitone/react/components/empty";
import {
  WorkspaceActions,
  WorkspaceContent,
  WorkspaceHeader,
  WorkspaceMain,
  WorkspaceShell,
} from "@allfitone/react/components/workspace-shell";

type DeviceGatePatternProps = {
  product: "Backoffice" | "Studio";
  theme: "dark" | "light";
};

export function DeviceGatePattern({ product, theme }: DeviceGatePatternProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">("idle");
  const [manualUrl, setManualUrl] = useState("");
  const manualCopyRef = useRef<HTMLInputElement>(null);
  const productName = `Allfit ${product}`;
  const badge =
    product === "Studio" ? (
      <Badge variant="sport">Studio</Badge>
    ) : (
      <Badge variant="outline">Backoffice</Badge>
    );

  return (
    <DeviceGate data-afo-theme={theme}>
      <DeviceGateFallback
        data-testid="device-gate-fallback"
      >
        <DeviceGateHeader>
          <BrandLockup
            surface={theme}
            title="Allfit One"
            width={148}
            height={40}
          />
          {badge}
        </DeviceGateHeader>

        <DeviceGateMain aria-labelledby="device-gate-title">
          <DeviceGateVisual />
          <DeviceGateEyebrow>Dispositivo no compatible</DeviceGateEyebrow>
          <DeviceGateTitle id="device-gate-title">
            Continúa en una pantalla más amplia.
          </DeviceGateTitle>
          <DeviceGateDescription>
            {productName} no está disponible en celular. Ábrelo desde una tablet
            o un computador.
          </DeviceGateDescription>
          <DeviceGateActions>
            <Button
              type="button"
              onClick={async () => {
                const url = window.location.href;
                try {
                  await navigator.clipboard.writeText(url);
                  setCopyState("copied");
                } catch {
                  setManualUrl(url);
                  setCopyState("manual");
                  window.requestAnimationFrame(() => manualCopyRef.current?.select());
                }
              }}
            >
              Copiar enlace
            </Button>
            <p className="device-gate-copy-status" role="status">
              {copyState === "copied" ? "Enlace copiado." : copyState === "manual" ? "Copia este enlace manualmente." : ""}
            </p>
          </DeviceGateActions>
          {copyState === "manual" ? (
            <div className="device-gate-manual-copy">
              <label htmlFor={`device-gate-copy-${product.toLowerCase()}`}>Enlace del espacio de trabajo</label>
              <Input
                id={`device-gate-copy-${product.toLowerCase()}`}
                ref={manualCopyRef}
                readOnly
                value={manualUrl}
                onFocus={(event) => event.currentTarget.select()}
              />
            </div>
          ) : null}
        </DeviceGateMain>
      </DeviceGateFallback>

      <DeviceGateContent>
        <WorkspaceShell data-testid="device-gate-workspace">
          <WorkspaceMain>
            <WorkspaceHeader>
              <BrandLockup
                surface={theme}
                title="Allfit One"
                width={148}
                height={40}
              />
              <WorkspaceActions>{badge}</WorkspaceActions>
            </WorkspaceHeader>
            <WorkspaceContent>
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Espacio de trabajo disponible.</EmptyTitle>
                  <EmptyDescription>
                    Esta composición permanece visible en tablet y computador.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </WorkspaceContent>
          </WorkspaceMain>
        </WorkspaceShell>
      </DeviceGateContent>
    </DeviceGate>
  );
}
