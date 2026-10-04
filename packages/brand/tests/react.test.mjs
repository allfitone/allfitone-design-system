import assert from "node:assert/strict";
import test from "node:test";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  BrandLockup,
  BrandLogo,
  BrandWordmark,
  ProductLockup,
  ProductWordmark,
} from "../dist/react.js";

const renderers = [
  ["BrandLogo", BrandLogo, {}],
  ["BrandWordmark", BrandWordmark, {}],
  ["BrandLockup", BrandLockup, {}],
  ["ProductWordmark", ProductWordmark, { product: "studio" }],
  ["ProductLockup", ProductLockup, { product: "backoffice" }],
];

for (const [name, Renderer, requiredProps] of renderers) {
  test(`${name} uses title as its accessible name`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { ...requiredProps, title: "Allfit One" }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label="Allfit One"/);
    assert.match(markup, /<title>Allfit One<\/title>/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  test(`${name} honors a standard aria-label`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { ...requiredProps, "aria-label": "Allfit One" }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-label="Allfit One"/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  test(`${name} honors external labelling`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { ...requiredProps, "aria-labelledby": "brand-name" }),
    );

    assert.match(markup, /role="img"/);
    assert.match(markup, /aria-labelledby="brand-name"/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
  });

  test(`${name} is decorative by default`, () => {
    const markup = renderToStaticMarkup(React.createElement(Renderer, requiredProps));

    assert.match(markup, /role="presentation"/);
    assert.match(markup, /aria-hidden="true"/);
  });
}

for (const product of ["space", "studio", "backoffice"]) {
  test(`ProductLockup reuses the canonical Allfit One logo for ${product}`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(ProductLockup, { product, title: `Allfit ${product}` }),
    );

    assert.match(markup, /fill="#55EFFB" d="M405 0 0 211l120 1L11 1149l324-490L405 0Z" transform="translate\(44 58\) scale\(\.318\)"/);
    assert.doesNotMatch(markup, /stroke=/);
  });
}

for (const [name, Renderer, requiredProps] of [
  ["BrandLockup", BrandLockup, {}],
  ["ProductLockup", ProductLockup, { product: "space" }],
]) {
  test(`${name} renders the plain cyan logo without a carrier`, () => {
    const markup = renderToStaticMarkup(
      React.createElement(Renderer, { ...requiredProps, title: "Allfit One" }),
    );

    assert.match(markup, /fill="#55EFFB" d="M405 0 0 211l120 1L11 1149l324-490L405 0Z"/);
    assert.doesNotMatch(markup, /M65 0h330/);
    assert.doesNotMatch(markup, /fill="#030713" d="M405 0 0 211/);
  });
}
