"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type MouseEvent,
} from "react";

import { Badge } from "@allfitone/react/components/badge";
import { buttonVariants } from "@allfitone/react/components/button";
import { Input } from "@allfitone/react/components/input";
import { FoundationIcon } from "@allfitone/react/icons";

import {
  componentCatalogItems,
  componentCategories,
  getComponentById,
  getComponentCategory,
  getComponentHref,
  isComponentCategorySlug,
  type ComponentCatalogItem,
  type ComponentCategorySlug,
} from "@/lib/component-catalog";

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("en");
}

function matchesSearch(component: ComponentCatalogItem, query: string) {
  if (!query) return true;

  return normalizeSearch([
    component.title,
    component.id,
    component.description,
    component.importPath,
    component.category,
    ...component.contract,
  ].join(" ")).includes(query);
}

export function LegacyCatalogHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || id === "overview") return;

    if (isComponentCategorySlug(id)) {
      router.replace(`/components/${id}`, { scroll: false });
      return;
    }

    const component = getComponentById(id);
    if (component) {
      router.replace(getComponentHref(component), { scroll: false });
    }
  }, [router]);

  return null;
}

export function ComponentIndex() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<ComponentCategorySlug | "all">(
    isComponentCategorySlug(initialCategory) ? initialCategory : "all",
  );
  const deferredQuery = useDeferredValue(query);

  const updateUrl = (nextQuery: string, nextCategory: ComponentCategorySlug | "all") => {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedQuery = nextQuery.trim();

    if (normalizedQuery) params.set("q", normalizedQuery);
    else params.delete("q");

    if (nextCategory === "all") params.delete("category");
    else params.set("category", nextCategory);

    const nextUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
    startTransition(() => router.replace(nextUrl, { scroll: false }));
  };

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(deferredQuery);
    return componentCatalogItems.filter((component) =>
      (category === "all" || component.category === category) &&
      matchesSearch(component, normalizedQuery),
    );
  }, [category, deferredQuery]);

  const isBrowsingComponents = query.trim().length > 0 || category !== "all";

  return (
    <section className="component-manifest component-index" aria-labelledby="component-index-title">
      <header className="component-manifest__header">
        <div>
          <span className="component-manifest__pulse" aria-hidden="true" />
          <span id="component-index-title">Find a component</span>
        </div>
        <Badge variant="outline">{componentCatalogItems.length} components</Badge>
      </header>

      <form className="component-index__search" role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="component-search">Search by name, contract or import</label>
        <div className="component-index__search-control">
          <FoundationIcon name="search" decorative />
          <Input
            id="component-search"
            type="search"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              updateUrl(nextQuery, category);
            }}
          />
        </div>
      </form>

      <div className="component-index__filters" aria-label="Filter by category">
        <button
          type="button"
          aria-pressed={category === "all"}
          onClick={() => {
            setCategory("all");
            updateUrl(query, "all");
          }}
        >
          All
        </button>
        {componentCategories.map((item) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={category === item.slug}
            onClick={() => {
              setCategory(item.slug);
              updateUrl(query, item.slug);
            }}
          >
            {item.code}
          </button>
        ))}
      </div>

      <div className="component-manifest__list" aria-live="polite">
        {isBrowsingComponents ? (
          results.length > 0 ? (
            results.map((component) => (
              <Link key={component.id} href={getComponentHref(component)}>
                <FoundationIcon name={getComponentCategory(component.category).icon} decorative />
                <span className="component-manifest__code">{getComponentCategory(component.category).code}</span>
                <span className="component-index__result-copy">
                  <strong>{component.title}</strong>
                  <small>{component.importPath}</small>
                </span>
                <FoundationIcon name="forward" decorative />
              </Link>
            ))
          ) : (
            <p className="component-index__empty">No components match this search. Try a component name or contract term.</p>
          )
        ) : (
          componentCategories.map((item) => (
            <Link key={item.slug} href={`/components/${item.slug}`}>
              <FoundationIcon name={item.icon} decorative />
              <span className="component-manifest__code">{item.code}</span>
              <span className="component-index__result-copy">
                <strong>{item.label}</strong>
                <small>{item.components.length} components</small>
              </span>
              <FoundationIcon name="forward" decorative />
            </Link>
          ))
        )}
      </div>

      <dl className="component-manifest__contract">
        <div><dt>Target</dt><dd>44 px</dd></div>
        <div><dt>Baseline</dt><dd>WCAG 2.2 AA</dd></div>
        <div><dt>Runtime</dt><dd>React 19</dd></div>
      </dl>
    </section>
  );
}

function focusComponent(id: string, behavior: ScrollBehavior = "smooth") {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior, block: "start" });
  const heading = target.querySelector<HTMLElement>("h3");
  window.requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
}

export function ComponentCategoryNavigator({ category }: { category: ComponentCategorySlug }) {
  const router = useRouter();
  const categoryMeta = getComponentCategory(category);
  const [activeId, setActiveId] = useState(categoryMeta.components[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const normalizedQuery = normalizeSearch(query);
  const matches = categoryMeta.components.filter((component) => matchesSearch(component, normalizedQuery));
  const globalIndex = componentCatalogItems.findIndex((component) => component.id === activeId);
  const previous = globalIndex > 0 ? componentCatalogItems[globalIndex - 1] : undefined;
  const next = globalIndex >= 0 ? componentCatalogItems[globalIndex + 1] : undefined;

  useEffect(() => {
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    if (categoryMeta.components.some((component) => component.id === hashId)) {
      window.requestAnimationFrame(() => {
        setActiveId(hashId);
        focusComponent(hashId, "auto");
      });
    }

    const elements = categoryMeta.components
      .map((component) => document.getElementById(component.id))
      .filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-24% 0px -62% 0px", threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));

    const restoreHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (categoryMeta.components.some((component) => component.id === id)) {
        setActiveId(id);
        focusComponent(id, "auto");
      }
    };
    window.addEventListener("hashchange", restoreHash);
    window.addEventListener("popstate", restoreHash);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", restoreHash);
      window.removeEventListener("popstate", restoreHash);
    };
  }, [categoryMeta.components]);

  const navigateWithinCategory = (event: MouseEvent<HTMLAnchorElement>, component: ComponentCatalogItem) => {
    if (component.category !== category) return;
    event.preventDefault();
    window.history.pushState(null, "", `#${component.id}`);
    setActiveId(component.id);
    setQuery("");
    focusComponent(component.id, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");
  };

  return (
    <nav className="component-local-nav" aria-label={`${categoryMeta.label} component navigation`}>
      <div className="component-local-nav__location">
        <span>{categoryMeta.code}</span>
        <strong>{categoryMeta.components.find((component) => component.id === activeId)?.title ?? categoryMeta.label}</strong>
      </div>

      <label className="component-local-nav__category">
        <span className="sr-only">Component category</span>
        <select
          aria-label="Component category"
          value={category}
          onChange={(event) => router.push(`/components/${event.target.value}`)}
        >
          {componentCategories.map((item) => <option key={item.slug} value={item.slug}>{item.label}</option>)}
        </select>
      </label>

      <div className="component-local-nav__search">
        <FoundationIcon name="search" decorative />
        <Input
          type="search"
          aria-label={`Search ${categoryMeta.label} components`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && matches[0]) {
              event.preventDefault();
              window.history.pushState(null, "", `#${matches[0].id}`);
              setActiveId(matches[0].id);
              setQuery("");
              focusComponent(matches[0].id);
            }
          }}
        />
        {query ? (
          <div className="component-local-nav__results">
            {matches.length > 0 ? matches.map((component) => (
              <a key={component.id} href={`#${component.id}`} onClick={(event) => navigateWithinCategory(event, component)}>
                <span>{component.title}</span>
                <small>{component.id}</small>
              </a>
            )) : <p>No matches</p>}
          </div>
        ) : null}
      </div>

      <div className="component-local-nav__sequence">
        {previous ? (
          <Link
            href={getComponentHref(previous)}
            className={buttonVariants({ variant: "outline", size: "icon-sm" })}
            aria-label={`Previous component: ${previous.title}`}
            onClick={(event) => navigateWithinCategory(event, previous)}
          >
            <FoundationIcon name="back" decorative />
          </Link>
        ) : <span className="component-local-nav__placeholder" aria-hidden="true" />}
        {next ? (
          <Link
            href={getComponentHref(next)}
            className={buttonVariants({ variant: "outline", size: "icon-sm" })}
            aria-label={`Next component: ${next.title}`}
            onClick={(event) => navigateWithinCategory(event, next)}
          >
            <FoundationIcon name="forward" decorative />
          </Link>
        ) : <span className="component-local-nav__placeholder" aria-hidden="true" />}
      </div>
    </nav>
  );
}
