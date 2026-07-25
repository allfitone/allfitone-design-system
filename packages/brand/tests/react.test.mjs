import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  BrandLockup,
  BrandLogo,
  BrandLogoCarrier,
  BrandWordmark,
} from "../dist/react.js";

const renderers = [
  ["BrandLogo", BrandLogo],
  ["BrandLogoCarrier", BrandLogoCarrier],
  ["BrandWordmark", BrandWordmark],
  ["BrandLockup", BrandLockup],
];

for (const [name, Renderer] of renderers) {
  test(`${name} uses title as its accessible name`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { title: "Allfit One" }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label="Allfit One"/);
    assert.match(markup, /<title>Allfit One<\/title>/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  test(`${name} honors a standard aria-label`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { "aria-label": "Allfit One" }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label="Allfit One"/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  test(`${name} honors external labelling`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { "aria-labelledby": "brand-name" }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-labelledby="brand-name"/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  test(`${name} is decorative by default`, () => {
    const markup = renderToStaticMarkup(React.createElement(Renderer));

    assert.match(markup, /role="presentation"/);
    assert.match(markup, /aria-hidden="true"/);
  });
}
