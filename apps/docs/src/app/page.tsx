import type { CSSProperties } from "react";

import {
  color,
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
} from "@allfitone/tokens";

import { BrandLockup, BrandLogo } from "@/components/brand-assets";
import { ThemeToggle } from "@/components/theme-toggle";

const colorGroups = [
  ["Brand", color.brand],
  ["Ink", color.ink],
  ["Neutral", color.neutral],
  ["Feedback", color.feedback],
] as const;

const navigation = ["Color", "Type", "Space", "Radius", "Shadow", "Motion", "Applied"];

const tokenLabel = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (character) => character.toUpperCase());

const shadowToCss = (layers: readonly ShadowLayer[]) =>
  layers.length === 0
    ? "none"
    : layers.map(({ x, y, blur, spread, color: layerColor }) => `${x}px ${y}px ${blur}px ${spread}px ${layerColor}`).join(", ");

function SectionHeader({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="section-heading">
      <p className="section-index">{index}</p>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: keyof typeof semanticColor }) {
  const tokens = semanticColor[theme];

  return (
    <article className="theme-preview" data-afo-theme={theme}>
      <div className="theme-preview__header">
        <span>{theme} theme</span>
        <span className="theme-preview__status">Live</span>
      </div>
      <div className="theme-preview__body">
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
        <button type="button" className="sample-button sample-button--primary">Review activity</button>
      </div>
      <footer>
        <code>{tokens.background.canvas}</code>
        <code>{tokens.text.primary}</code>
        <code>{tokens.action.primary}</code>
      </footer>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <header className="topbar page-shell">
        <a className="brand" href="#top" aria-label="Allfit One UI Foundation home">
          <BrandLockup priority />
          <i>UI FOUNDATION</i>
        </a>
        <nav aria-label="Foundation sections">
          {navigation.map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
        </nav>
        <ThemeToggle />
      </header>

      <section id="top" className="hero page-shell">
        <div className="hero-copy">
          <p className="eyebrow">Cross-platform foundation / v0.1</p>
          <h1>The system<br />before the <em>screen.</em></h1>
          <p className="hero-description">
            One visual language for Allfit Space and Allfit OS. Primitive values stay stable; semantic tokens adapt to product, platform, and theme.
          </p>
        </div>
        <div className="hero-signature" aria-hidden="true">
          <BrandLogo />
        </div>
        <dl className="hero-metrics">
          <div><dt>Foundations</dt><dd>06</dd></div>
          <div><dt>Themes</dt><dd>02</dd></div>
          <div><dt>Outputs</dt><dd>03</dd></div>
        </dl>
      </section>

      <section id="color" className="foundation-section page-shell">
        <SectionHeader index="01" title="Color" description="Brand primitives stay exact. Semantic color carries meaning across themes." />
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

      <section id="type" className="foundation-section page-shell">
        <SectionHeader index="02" title="Typography" description="Barlow Condensed creates athletic character. Manrope carries interface clarity." />
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

      <section id="space" className="foundation-section page-shell">
        <SectionHeader index="03" title="Spacing" description="A 4 px rhythm with one 2 px optical half-step and a protected 44 px touch target." />
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

      <section id="radius" className="foundation-section page-shell">
        <SectionHeader index="04" title="Radius" description="Curvature communicates function and hierarchy; it is never default decoration." />
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

      <section id="shadow" className="foundation-section page-shell">
        <SectionHeader index="05" title="Shadow" description="Elevation stays quiet. Cyan glow is reserved for one signature moment." />
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

      <section id="motion" className="foundation-section page-shell">
        <SectionHeader index="06" title="Motion" description="Motion explains response and continuity. Hover each track to compare duration." />
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

      <section id="applied" className="foundation-section page-shell">
        <SectionHeader index="07" title="Applied sample" description="A visual stress test of the foundations—not a final component API." />
        <div className="applied-grid">
          <article className="sample-panel sample-panel--wide">
            <div className="sample-panel__header"><div><span>Performance overview</span><strong>Training load</strong></div><span className="status-dot">Live</span></div>
            <div className="sample-stats">
              <div><span>Volume</span><strong>42,840 kg</strong><small>+8.4%</small></div>
              <div><span>Sessions</span><strong>18</strong><small>+3</small></div>
              <div><span>Consistency</span><strong>92%</strong><small>On track</small></div>
            </div>
            <div className="sample-graph" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /></div>
          </article>
          <article className="sample-panel">
            <div className="sample-panel__header"><div><span>Controls</span><strong>Foundation states</strong></div></div>
            <label className="sample-field"><span>Program name</span><input defaultValue="Hybrid strength" /></label>
            <label className="sample-field"><span>Training goal</span><select defaultValue="performance"><option value="performance">Performance</option></select></label>
            <div className="sample-actions"><button type="button" className="sample-button sample-button--primary">Save changes</button><button type="button" className="sample-button sample-button--secondary">Cancel</button></div>
          </article>
          <article className="sample-panel">
            <div className="sample-panel__header"><div><span>Status</span><strong>System feedback</strong></div></div>
            <div className="status-list"><span data-status="success">Synced</span><span data-status="warning">Review needed</span><span data-status="danger">Payment failed</span><span data-status="info">New activity</span></div>
          </article>
        </div>
      </section>

      <footer className="footer page-shell">
        <div className="brand"><BrandLockup /></div>
        <p>UI Foundation / Tokens v0.1</p>
        <p>Space + OS / One visual language</p>
      </footer>
    </main>
  );
}
