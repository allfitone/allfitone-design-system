import type { Metadata } from "next"

import { BrandLockup } from "@allfitone/react/brand"
import {
  AccessDescription,
  AccessEyebrow,
  AccessHeader,
  AccessHero,
  AccessJourney,
  AccessJourneyIndex,
  AccessJourneyLabel,
  AccessJourneyStep,
  AccessMain,
  AccessPanel,
  AccessPanelAction,
  AccessPanelContent,
  AccessPanelDescription,
  AccessPanelEyebrow,
  AccessPanelHeader,
  AccessPanelNote,
  AccessPanelTitle,
  AccessShell,
  AccessTitle,
} from "@allfitone/react/components/access-shell"
import { Badge } from "@allfitone/react/components/badge"
import { buttonVariants } from "@allfitone/react/components/button"
import { PulseMark } from "@allfitone/react/components/pulse-mark"
import { ForwardIcon, FoundationIcon } from "@allfitone/react/icons"

export const metadata: Metadata = {
  title: "Access pattern | Allfit One Design System",
  description: "Responsive access composition for Allfit One web products.",
}

export default function AccessPatternPage() {
  return (
    <AccessShell data-afo-theme="light">
      <AccessHeader>
        <BrandLockup
          surface="light"
          title="Allfit One"
          width={120}
          height={40}
        />
        <Badge variant="sport">Studio</Badge>
      </AccessHeader>

      <AccessMain>
        <AccessHero aria-labelledby="access-pattern-title">
          <AccessEyebrow>
            <PulseMark />
            Studio para profesionales
          </AccessEyebrow>
          <AccessTitle id="access-pattern-title">
            Haz que cada entrenamiento cuente.
          </AccessTitle>
          <AccessDescription>
            Planifica con contexto, acompaña con claridad y ajusta sin perder la
            continuidad de cada persona.
          </AccessDescription>
        </AccessHero>

        <AccessPanel aria-labelledby="access-panel-title">
          <AccessPanelHeader>
            <AccessPanelEyebrow>Tu espacio de trabajo</AccessPanelEyebrow>
            <AccessPanelTitle id="access-panel-title">
              Entra. El contexto ya está listo.
            </AccessPanelTitle>
            <AccessPanelDescription>
              Accede de forma segura para continuar con tus personas, planes y
              sesiones.
            </AccessPanelDescription>
          </AccessPanelHeader>

          <AccessPanelContent>
            <AccessPanelAction>
              <a
                data-slot="button"
                data-variant="default"
                className={buttonVariants({ size: "lg" })}
                href="#access-pattern-title"
              >
                Entrar a Studio
                <ForwardIcon data-icon="inline-end" decorative />
              </a>
            </AccessPanelAction>
          </AccessPanelContent>

          <AccessPanelNote>
            <FoundationIcon name="permissions" decorative />
            El inicio de sesión se completa con el proveedor de identidad de
            Allfit One.
          </AccessPanelNote>
        </AccessPanel>

        <AccessJourney aria-label="Flujo de trabajo en Studio">
          <AccessJourneyStep>
            <AccessJourneyIndex>01</AccessJourneyIndex>
            <AccessJourneyLabel>Planifica</AccessJourneyLabel>
          </AccessJourneyStep>
          <AccessJourneyStep>
            <AccessJourneyIndex>02</AccessJourneyIndex>
            <AccessJourneyLabel>Acompaña</AccessJourneyLabel>
          </AccessJourneyStep>
          <AccessJourneyStep>
            <AccessJourneyIndex>03</AccessJourneyIndex>
            <AccessJourneyLabel>Ajusta</AccessJourneyLabel>
          </AccessJourneyStep>
        </AccessJourney>
      </AccessMain>
    </AccessShell>
  )
}
