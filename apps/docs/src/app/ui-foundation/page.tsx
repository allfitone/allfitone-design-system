import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  BrandLockup,
  BrandLogo,
  BrandLogoCarrier,
  BrandWordmark,
} from "@allfitone/react/brand";
import { Badge } from "@allfitone/react/components/badge";
import { Button } from "@allfitone/react/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@allfitone/react/components/card";
import { Field, FieldGroup, FieldLabel } from "@allfitone/react/components/field";
import { Input } from "@allfitone/react/components/input";
import { PulseMark } from "@allfitone/react/components/pulse-mark";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@allfitone/react/components/select";
import {
  StatStrip,
  StatStripItem,
} from "@allfitone/react/components/stat-strip";
import { FoundationIcon, iconCatalog, type IconName } from "@allfitone/react/icons";
import {
  color,
  designSystemVersion as tokensPackageVersion,
  motion,
  radius,
  semanticColor,
  semanticRadius,
  semanticShadow,
  semanticSpacing,
  shadow,
  spacing,
  typography,
  type ShadowLayer,
} from "@allfitone/react/tokens";

import {
  DesignSystemFooter,
  DesignSystemLayout,
} from "@/components/design-system-shell";
import {
  AllfitOsLockup,
  AllfitOsMark,
  AllfitOsWordmark,
} from "@/components/allfit-os-brand";

export const metadata: Metadata = {
  title: "UI Foundation | Allfit One Design System",
  description: "Visual reference for the Allfit One cross-platform design tokens.",
};

const colorGroups = [
  ["Brand", color.brand],
  ["Ink", color.ink],
  ["Neutral", color.neutral],
  ["Feedback", color.feedback],
] as const;

const iconNames = Object.keys(iconCatalog) as IconName[];
const trainingGoals = [
  { label: "Performance", value: "performance" },
  { label: "General fitness", value: "general-fitness" },
  { label: "Recovery", value: "recovery" },
];
const foundationAreas = [
  { code: "BRD", label: "Brand assets", hash: "brand-assets" },
  { code: "COL", label: "Color", hash: "color" },
  { code: "TYP", label: "Typography", hash: "type" },
  { code: "ICO", label: "Iconography", hash: "icons" },
  { code: "SPC", label: "Spacing", hash: "space" },
  { code: "RAD", label: "Radius", hash: "radius" },
  { code: "SHD", label: "Shadow", hash: "shadow" },
  { code: "MOT", label: "Motion", hash: "motion" },
  { code: "APL", label: "Applied sample", hash: "applied" },
] as const;

const tokenLabel = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());

const shadowToCss = (layers: readonly ShadowLayer[]) =>
  layers.length === 0
    ? "none"
    : layers.map(({ x, y, blur, spread, color: layerColor }) => `${x}px ${y}px ${blur}px ${spread}px ${layerColor}`).join(", ");

function SectionHeader({ code, title, description }: { code: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading__title">
        <Badge variant="code" className="section-heading__code">{code}</Badge>
        <h2>{title}</h2>
      </div>
      <p className="section-heading__description">{description}</p>
    </div>
  );
}

function ThemePreview({ theme }: { theme: keyof typeof semanticColor }) {
  const tokens = semanticColor[theme];

  return (
    <Card
      className="theme-preview"
      data-afo-theme={theme}
      role="article"
      aria-label={`${theme} theme preview`}
    >
      <CardHeader className="theme-preview__header">
        <CardTitle>{theme} theme</CardTitle>
        <CardAction>
          <Badge variant="success" className="theme-preview__status">Live</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="theme-preview__body">
        <div className="theme-preview__metric">
          <span>Weekly volume</span>
          <strong>42.8K</strong>
          <small>+8.4% this week</small>
        </div>
        <div className="theme-preview__chart" aria-hidden="true">
          {[32, 48, 40, 66, 58, 82, 72].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <Button type="button" className="theme-preview__action">Review activity</Button>
      </CardContent>
      <CardFooter className="theme-preview__footer">
        <code>{tokens.background.canvas}</code>
        <code>{tokens.text.primary}</code>
        <code>{tokens.action.primary}</code>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  return (
    <DesignSystemLayout
      current="foundations"
      id="top"
      className="design-system-workspace foundation-guide"
      label="UI Foundation"
      homeHref="#top"
      topHref="#top"
      skipHref="#guide-content"
      skipLabel="Skip to foundation content"
    >
      <div id="guide-content" className="design-system-content">
        <section id="overview" className="guide-overview">
          <div className="guide-overview__copy">
            <div className="foundation-overview__eyebrow">
              <PulseMark />
              <span>Allfit One / System calibration</span>
            </div>
            <h1>UI Foundation</h1>
            <p className="foundation-overview__thesis">Define once. Resolve everywhere.</p>
            <p>
              Trace every visual decision from primitive value to semantic role and production output across Allfit Space and Allfit OS.
            </p>
            <div className="guide-overview__links">
              <a href="#foundation-index">Open the index</a>
              <Link href="/components">Inspect components <FoundationIcon name="external" decorative /></Link>
            </div>
          </div>

          <aside className="foundation-resolver" aria-label="Token resolution example">
            <header className="foundation-resolver__header">
              <div>
                <span className="foundation-resolver__status" aria-hidden="true" />
                <span>Token resolver</span>
              </div>
              <Badge variant="outline">v{tokensPackageVersion}</Badge>
            </header>
            <ol className="foundation-resolver__chain">
              <li>
                <span>Source</span>
                <code>brand.primary</code>
                <strong>#55EFFB</strong>
              </li>
              <li>
                <span>Meaning</span>
                <code>action.primary</code>
                <strong>Semantic role</strong>
              </li>
              <li>
                <span>Output</span>
                <code>--afo-color-action-primary</code>
                <strong>Platform adapter</strong>
              </li>
            </ol>
            <dl className="foundation-resolver__contract">
              <div><dt>Base</dt><dd>4 px</dd></div>
              <div><dt>Targets</dt><dd>44 / 48</dd></div>
              <div><dt>Themes</dt><dd>Dark / light</dd></div>
            </dl>
          </aside>
        </section>

        <nav id="foundation-index" className="foundation-index" aria-label="Foundation areas">
          <header>
            <div>
              <PulseMark />
              <span>Foundation index</span>
            </div>
            <span>{foundationAreas.length} calibration areas</span>
          </header>
          <div className="foundation-index__grid">
            {foundationAreas.map((area) => (
              <a key={area.code} href={`#${area.hash}`}>
                <span>{area.code}</span>
                <strong>{area.label}</strong>
                <FoundationIcon name="forward" decorative />
              </a>
            ))}
          </div>
        </nav>

        <section id="brand-assets" className="foundation-section brand-assets-section">
        <SectionHeader
          code="BRD"
          title="Brand assets"
          description="Identity assets organized by product, with the correct variant, size, and role for each placement."
        />

        <div className="brand-product-stack">
          <section className="brand-product" aria-labelledby="allfit-one-assets">
            <header className="brand-product__header">
              <span className="brand-product__code">Master brand</span>
              <div>
                <h3 id="allfit-one-assets">Allfit One</h3>
                <p>The ecosystem identity. Use these assets whenever the parent brand must be recognized.</p>
              </div>
              <span className="brand-asset-status">Canonical</span>
            </header>

            <div className="brand-asset-grid brand-asset-grid--allfit-one">
              <article className="brand-asset-card brand-asset-card--logo">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Symbol</span>
                    <h4>Logo</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--logo">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <BrandLogo variant="cyan" title="Allfit One" />
                  </div>
                  <div className="brand-asset-preview__scale" aria-label="Recommended logo sizes">
                    {[64, 48, 32].map((size) => (
                      <span key={size}>
                        <BrandLogo variant="cyan" aria-hidden="true" style={{ height: `${size}px` }} />
                        <small>{size}</small>
                      </span>
                    ))}
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>Compact and vertical placements</dd></div>
                  <div><dt>Minimum</dt><dd>32 px high</dd></div>
                  <div><dt>Standard</dt><dd>32 / 48 / 64 px high</dd></div>
                  <div><dt>Ratio</dt><dd>405 : 1149</dd></div>
                </dl>
              </article>

              <article className="brand-asset-card brand-asset-card--carrier">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Contained symbol</span>
                    <h4>Logo with carrier</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--paired">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <BrandLogoCarrier title="Allfit One" />
                    <small>On dark</small>
                  </div>
                  <div className="brand-asset-preview__surface" data-surface="light">
                    <BrandLogoCarrier title="Allfit One" />
                    <small>On light</small>
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>App entry points and avatars</dd></div>
                  <div><dt>Minimum</dt><dd>32 px high</dd></div>
                  <div><dt>Standard</dt><dd>32 / 48 / 64 px high</dd></div>
                  <div><dt>Ratio</dt><dd>23 : 24</dd></div>
                </dl>
              </article>

              <article className="brand-asset-card brand-asset-card--wordmark">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Name</span>
                    <h4>Wordmark</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--paired">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <BrandWordmark surface="dark" title="Allfit One" />
                    <small>On dark</small>
                  </div>
                  <div className="brand-asset-preview__surface" data-surface="light">
                    <BrandWordmark surface="light" title="Allfit One" />
                    <small>On light</small>
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>When the symbol is already nearby</dd></div>
                  <div><dt>Minimum</dt><dd>20 px high</dd></div>
                  <div><dt>Standard</dt><dd>20 / 24 / 32 px high</dd></div>
                  <div><dt>Ratio</dt><dd>4047 : 756</dd></div>
                </dl>
              </article>

              <article className="brand-asset-card brand-asset-card--lockup">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Primary signature</span>
                    <h4>Logo + wordmark</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--paired">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <BrandLockup surface="dark" title="Allfit One" />
                    <small>On dark</small>
                  </div>
                  <div className="brand-asset-preview__surface" data-surface="light">
                    <BrandLockup surface="light" title="Allfit One" />
                    <small>On light</small>
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>Primary brand identification</dd></div>
                  <div><dt>Minimum</dt><dd>32 px high</dd></div>
                  <div><dt>Standard</dt><dd>32 / 40 / 48 px high</dd></div>
                  <div><dt>Ratio</dt><dd>1678 : 480</dd></div>
                </dl>
              </article>
            </div>
          </section>

          <section className="brand-product brand-product--os" aria-labelledby="allfit-os-assets">
            <header className="brand-product__header">
              <span className="brand-product__code">Product brand</span>
              <div>
                <h3 id="allfit-os-assets">Allfit OS</h3>
                <p>The professional workspace identity. Keep it inside Allfit OS product surfaces.</p>
              </div>
              <span className="brand-asset-status brand-asset-status--provisional">Provisional</span>
            </header>

            <div className="brand-asset-grid brand-asset-grid--allfit-os">
              <article className="brand-asset-card brand-asset-card--os-mark">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Symbol</span>
                    <h4>Logo</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--paired">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <AllfitOsMark title="Allfit OS" />
                    <small>On dark</small>
                  </div>
                  <div className="brand-asset-preview__surface" data-surface="light">
                    <AllfitOsMark title="Allfit OS" />
                    <small>On light</small>
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>Compact product identification</dd></div>
                  <div><dt>Minimum</dt><dd>24 px wide</dd></div>
                  <div><dt>Standard</dt><dd>24 / 32 / 40 px wide</dd></div>
                  <div><dt>Color</dt><dd>Allfit cyan only</dd></div>
                </dl>
              </article>

              <article className="brand-asset-card brand-asset-card--os-wordmark">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Name</span>
                    <h4>Wordmark</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--paired">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <AllfitOsWordmark surface="dark" />
                    <small>On dark</small>
                  </div>
                  <div className="brand-asset-preview__surface" data-surface="light">
                    <AllfitOsWordmark surface="light" />
                    <small>On light</small>
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>When the signal is already visible</dd></div>
                  <div><dt>Minimum</dt><dd>20 px high</dd></div>
                  <div><dt>Standard</dt><dd>20 / 24 / 32 px high</dd></div>
                  <div><dt>Alignment</dt><dd>Equal optical cap height</dd></div>
                </dl>
              </article>

              <article className="brand-asset-card brand-asset-card--os-lockup">
                <header>
                  <div>
                    <span className="brand-asset-card__index">Primary signature</span>
                    <h4>Logo + wordmark</h4>
                  </div>
                </header>
                <div className="brand-asset-preview brand-asset-preview--paired">
                  <div className="brand-asset-preview__surface" data-surface="dark">
                    <AllfitOsLockup surface="dark" />
                    <small>On dark</small>
                  </div>
                  <div className="brand-asset-preview__surface" data-surface="light">
                    <AllfitOsLockup surface="light" />
                    <small>On light</small>
                  </div>
                </div>
                <dl className="brand-asset-specs">
                  <div><dt>Use for</dt><dd>Allfit OS shell and product entry</dd></div>
                  <div><dt>Minimum</dt><dd>24 px high</dd></div>
                  <div><dt>Standard</dt><dd>24 / 32 / 40 px high</dd></div>
                  <div><dt>Status</dt><dd>Canonical SVG pending</dd></div>
                </dl>
              </article>
            </div>
          </section>
        </div>

        <div className="brand-usage-rules" aria-label="Brand asset rules">
          <p><strong>Keep proportions</strong><small>Never stretch, skew, or redraw.</small></p>
          <p><strong>Match the surface</strong><small>Use the on-light or on-dark export.</small></p>
          <p><strong>Preserve emphasis</strong><small>Keep ONE and OS in Allfit cyan.</small></p>
          <p><strong>Name accessibly</strong><small>Expose the matching product name.</small></p>
        </div>
        <p className="token-note brand-assets-note">
          Source of truth: <code>@allfitone/brand</code>. The Allfit OS reference is documented for review but must not be exported as canonical artwork yet.
        </p>
      </section>

      <section id="color" className="foundation-section">
        <SectionHeader code="COL" title="Color" description="Brand primitives stay exact. Semantic color carries meaning across themes." />
        <div className="color-groups">
          {colorGroups.map(([groupName, values]) => (
            <article key={groupName} className="token-group">
              <h3>{groupName}</h3>
              <div className="swatch-grid">
                {Object.entries(values).map(([name, value]) => (
                  <div key={name} className="swatch" style={{ "--swatch-color": value } as CSSProperties}>
                    <div className="swatch__color" />
                    <div><strong>{tokenLabel(name)}</strong><code>{value}</code></div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="theme-grid">
          <ThemePreview theme="dark" />
          <ThemePreview theme="light" />
        </div>
      </section>

      <section id="type" className="foundation-section">
        <SectionHeader code="TYP" title="Typography" description="Barlow Condensed creates athletic character. Manrope carries interface clarity." />
        <div className="type-specimens">
          <article className="display-specimen">
            <div className="specimen-meta"><span>Display / Bold</span><code>Barlow Condensed 700</code></div>
            <p>Move with<br /><em>intent.</em></p>
          </article>
          <article className="body-specimen">
            <div className="specimen-meta"><span>Body / Regular</span><code>Manrope 400</code></div>
            <p>Training is complex. The interface should make the next action obvious without removing the depth athletes and professionals need.</p>
            <div className="weight-row">
              {Object.entries(typography.weight).map(([name, value]) => (
                <span key={name} style={{ fontWeight: value }}><b>Aa</b><small>{name} / {value}</small></span>
              ))}
            </div>
          </article>
        </div>
        <div className="type-scale">
          {Object.entries(typography.size).map(([name, value]) => (
            <div key={name}><code>{name} / {value}px</code><span style={{ fontSize: `${Math.min(value, 80)}px` }}>Ag</span></div>
          ))}
        </div>
      </section>

      <section id="icons" className="foundation-section">
        <SectionHeader code="ICO" title="Iconography" description="One semantic vocabulary across products. Lucide provides geometry; Allfit One defines meaning, scale, and stroke." />
        <div className="icon-grid">
          {iconNames.map((name) => (
            <article key={name} className="icon-token">
              <FoundationIcon name={name} size="lg" />
              <div>
                <strong>{tokenLabel(name)}</strong>
                <code>{iconCatalog[name].source}</code>
              </div>
              <small>{iconCatalog[name].category}</small>
            </article>
          ))}
        </div>
        <p className="token-note">Default: 20 px / 1.75 stroke. Semantic names remain stable even if source geometry evolves.</p>
      </section>

      <section id="space" className="foundation-section">
        <SectionHeader code="SPC" title="Spacing" description="A 4 px rhythm with one 2 px optical half-step, 44 px Web/iOS targets, and 48 dp Android targets." />
        <div className="space-scale">
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name}>
              <code>{name}</code>
              <span className="space-bar" style={{ width: `${Math.max(value, 2)}px` }} />
              <small>{value}px</small>
            </div>
          ))}
        </div>
        <div className="semantic-strip">
          {Object.entries(semanticSpacing).map(([name, value]) => (
            <div key={name}><span>{tokenLabel(name)}</span><strong>{value}px</strong></div>
          ))}
        </div>
      </section>

      <section id="radius" className="foundation-section">
        <SectionHeader code="RAD" title="Radius" description="Curvature communicates function and hierarchy; it is never default decoration." />
        <div className="radius-grid">
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} className="radius-token">
              <span style={{ borderRadius: `${value}px` }} />
              <div><strong>{name}</strong><code>{value}px</code></div>
            </div>
          ))}
        </div>
        <div className="radius-roles">
          {Object.entries(semanticRadius).map(([name, value]) => (
            <span key={name}>{tokenLabel(name)} <b>{value}px</b></span>
          ))}
        </div>
      </section>

      <section id="shadow" className="foundation-section">
        <SectionHeader code="SHD" title="Shadow" description="Elevation stays quiet. Cyan glow is reserved for one signature moment." />
        <div className="shadow-grid">
          {Object.entries(semanticShadow).map(([name, layers]) => (
            <article key={name} style={{ boxShadow: shadowToCss(layers) }}>
              <span>{tokenLabel(name)}</span>
              <code>{layers.length} layer{layers.length === 1 ? "" : "s"}</code>
            </article>
          ))}
        </div>
        <p className="token-note">Primitive range: {Object.keys(shadow).join(" / ")}</p>
      </section>

      <section id="motion" className="foundation-section">
        <SectionHeader code="MOT" title="Motion" description="Motion explains response and continuity. Hover each track to compare duration." />
        <div className="motion-list">
          {Object.entries(motion.duration).filter(([name]) => name !== "instant").map(([name, value]) => (
            <div key={name} className="motion-row">
              <div><strong>{tokenLabel(name)}</strong><code>{value}ms</code></div>
              <div className="motion-track" style={{ "--motion-duration": `${value}ms` } as CSSProperties}><span /></div>
            </div>
          ))}
        </div>
        <div className="easing-grid">
          {Object.entries(motion.easing).map(([name, value]) => (
            <div key={name}><span>{tokenLabel(name)}</span><code>{value.join(", ")}</code></div>
          ))}
        </div>
      </section>

      <section id="applied" className="foundation-section">
        <SectionHeader code="APL" title="Applied sample" description="A composition of public components under production-like content and layout pressure." />
        <div className="applied-grid">
          <Card className="sample-panel sample-panel--wide" role="article" aria-labelledby="training-load-title">
            <CardHeader className="sample-panel__header">
              <div>
                <span>Performance overview</span>
                <CardTitle id="training-load-title">Training load</CardTitle>
              </div>
              <CardAction>
                <Badge variant="success" className="status-dot">Live</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="sample-panel__content">
              <StatStrip className="sample-stats">
                <StatStripItem value="42,840 kg" label="Volume" />
                <StatStripItem value="18" label="Sessions" />
                <StatStripItem value="92%" label="Consistency" />
              </StatStrip>
              <div className="sample-graph" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /></div>
            </CardContent>
          </Card>
          <Card className="sample-panel" role="article" aria-labelledby="foundation-states-title">
            <CardHeader className="sample-panel__header">
              <div>
                <span>Controls</span>
                <CardTitle id="foundation-states-title">Foundation states</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="sample-panel__content">
              <FieldGroup className="sample-form">
                <Field>
                  <FieldLabel htmlFor="program-name">Program name</FieldLabel>
                  <Input id="program-name" defaultValue="Hybrid strength" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="training-goal">Training goal</FieldLabel>
                  <Select items={trainingGoals} defaultValue="performance">
                    <SelectTrigger id="training-goal" className="w-full" aria-label="Training goal">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {trainingGoals.map((goal) => (
                          <SelectItem key={goal.value} value={goal.value}>{goal.label}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <div className="sample-actions">
                <Button type="button">Save changes</Button>
                <Button type="button" variant="outline">Cancel</Button>
              </div>
            </CardContent>
          </Card>
          <Card className="sample-panel" role="article" aria-labelledby="system-feedback-title">
            <CardHeader className="sample-panel__header">
              <div>
                <span>Status</span>
                <CardTitle id="system-feedback-title">System feedback</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="sample-panel__content">
              <div className="status-list">
                <Badge variant="success">Synced</Badge>
                <Badge variant="warning">Review needed</Badge>
                <Badge variant="destructive">Payment failed</Badge>
                <Badge variant="info">New activity</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

        <DesignSystemFooter label="UI Foundation / Tokens" version={tokensPackageVersion} />
      </div>
    </DesignSystemLayout>
  );
}
