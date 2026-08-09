import { BrandLockup } from "@allfitone/react/brand";
import { Badge } from "@allfitone/react/components/badge";
import {
  DeviceGate,
  DeviceGateContent,
  DeviceGateDescription,
  DeviceGateEyebrow,
  DeviceGateFallback,
  DeviceGateHeader,
  DeviceGateMain,
  DeviceGateTitle,
  DeviceGateVisual,
} from "@allfitone/react/components/device-gate";
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
        aria-labelledby="device-gate-title"
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

        <DeviceGateMain>
          <DeviceGateVisual />
          <DeviceGateEyebrow>Dispositivo no compatible</DeviceGateEyebrow>
          <DeviceGateTitle id="device-gate-title">
            Continúa en una pantalla más amplia.
          </DeviceGateTitle>
          <DeviceGateDescription>
            {productName} no está disponible en celular. Ábrelo desde una tablet
            o un computador.
          </DeviceGateDescription>
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
