import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { iconCatalog } from "../dist/index.js";
import * as iconReact from "../dist/react.js";

const { FoundationIcon } = iconReact;

function render(props) {
  return renderToStaticMarkup(
    React.createElement(FoundationIcon, { name: "success", ...props }),
  );
}

function lucideClass(source) {
  return source
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .toLowerCase();
}

test("every semantic icon renders its declared Lucide source", () => {
  for (const [name, definition] of Object.entries(iconCatalog)) {
    const markup = renderToStaticMarkup(
      React.createElement(FoundationIcon, { name }),
    );
    assert.match(
      markup,
      new RegExp(`class="[^"]*lucide-${lucideClass(definition.source)}(?:\\s|")`),
      `${name} must render ${definition.source}`,
    );
  }
});

test("every semantic icon has a matching static export", () => {
  for (const [name, definition] of Object.entries(iconCatalog)) {
    const exportName = `${name[0].toUpperCase()}${name.slice(1)}Icon`;
    const StaticIcon = iconReact[exportName];
    assert.ok(StaticIcon, `Missing static export ${exportName}`);

    const markup = renderToStaticMarkup(React.createElement(StaticIcon));
    assert.match(
      markup,
      new RegExp(`class="[^"]*lucide-${lucideClass(definition.source)}(?:\\s|")`),
      `${exportName} must render ${definition.source}`,
    );
  }
});

// Named here as well as covered by the loops above: `duplicate` is the glyph a
// destructive-and-copy row asks for, and a product may not draw its own.
test("duplicate is catalogued and resolves to a component", () => {
  assert.equal(iconCatalog.duplicate.source, "Copy");
  assert.equal(iconCatalog.duplicate.category, "action");
  assert.ok(iconReact.DuplicateIcon, "Missing static export DuplicateIcon");

  const markup = renderToStaticMarkup(
    React.createElement(FoundationIcon, { name: "duplicate" }),
  );
  assert.match(markup, /class="[^"]*lucide-copy(?:\s|")/);
});

// The three a share screen asks for: pick a picture, keep the image, hand it on.
test("image, download and share are catalogued and resolve to components", () => {
  for (const [name, source, lucide] of [
    ["image", "Image", "image"],
    ["download", "Download", "download"],
    ["share", "Share", "share"],
  ]) {
    assert.equal(iconCatalog[name]?.source, source);
    assert.equal(iconCatalog[name]?.category, "action");
    const markup = renderToStaticMarkup(React.createElement(FoundationIcon, { name }));
    assert.match(markup, new RegExp(`class="[^"]*lucide-${lucide}(?:\\s|")`));
  }
});

test("standard ARIA naming mechanisms remain accessible", () => {
  const labelled = render({ "aria-label": "Synced" });
  assert.match(labelled, /aria-label="Synced"/);
  assert.match(labelled, /aria-hidden="false"/);
  assert.match(labelled, /role="img"/);

  const externallyLabelled = render({ "aria-labelledby": "sync-status" });
  assert.match(externallyLabelled, /aria-labelledby="sync-status"/);
  assert.match(externallyLabelled, /aria-hidden="false"/);
  assert.match(externallyLabelled, /role="img"/);
});

test("explicit ARIA visibility and role take precedence", () => {
  const visible = render({ "aria-hidden": false, role: "button" });
  assert.match(visible, /aria-hidden="false"/);
  assert.match(visible, /role="button"/);

  const hidden = render({
    "aria-label": "Ignored while decorative",
    decorative: true,
  });
  assert.match(hidden, /aria-hidden="true"/);
  assert.match(hidden, /role="presentation"/);
  assert.doesNotMatch(hidden, /aria-label=/);
});

test("icons are decorative by default", () => {
  const markup = render();
  assert.match(markup, /aria-hidden="true"/);
  assert.match(markup, /role="presentation"/);
});

test("named semantic exports retain the shared rendering contract", () => {
  const markup = renderToStaticMarkup(
    React.createElement(iconReact.BackIcon, {
      "aria-label": "Back",
      size: "sm",
      strokeScale: "compact",
    }),
  );
  assert.match(markup, /lucide-arrow-left/);
  assert.match(markup, /width="16"/);
  assert.match(markup, /height="16"/);
  assert.match(markup, /stroke-width="2"/);
  assert.match(markup, /aria-label="Back"/);
});

test("custom scale overrides must be positive finite numbers", () => {
  const custom = render({ customSize: 18, customStrokeWidth: 1.25 });
  assert.match(custom, /width="18"/);
  assert.match(custom, /stroke-width="1.25"/);

  assert.throws(() => render({ customSize: 0 }), RangeError);
  assert.throws(
    () => render({ customStrokeWidth: Number.POSITIVE_INFINITY }),
    RangeError,
  );
});
