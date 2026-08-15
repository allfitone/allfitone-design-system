"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Badge } from "@allfitone/react/components/badge";
import { Button, buttonVariants } from "@allfitone/react/components/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@allfitone/react/components/command";
import { IconButton } from "@allfitone/react/components/icon-button";
import { Input } from "@allfitone/react/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@allfitone/react/components/select";
import { FoundationIcon } from "@allfitone/react/icons";

import {
  componentCatalogItems,
  componentCategories,
  getCategoryNumeral,
  getComponentById,
  getComponentCategory,
  getComponentHref,
  getComponentNumeral,
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
            placeholder="Button, focus return, 44 px…"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              updateUrl(nextQuery, category);
            }}
          />
        </div>
      </form>

      <div className="component-index__filters">
        <label htmlFor="component-category-filter">Category</label>
        <Select
          value={category}
          onValueChange={(value) => {
            const nextCategory = value as ComponentCategorySlug | "all";
            setCategory(nextCategory);
            updateUrl(query, nextCategory);
          }}
        >
          <SelectTrigger id="component-category-filter">
            <SelectValue>
              {(value: ComponentCategorySlug | "all") =>
                value === "all" ? "All categories" : getComponentCategory(value).label
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="all">All categories</SelectItem>
              {componentCategories.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div
        className="component-manifest__list"
        data-view={isBrowsingComponents ? "results" : "categories"}
        aria-live="polite"
      >
        {isBrowsingComponents ? (
          results.length > 0 ? (
            results.map((component) => (
              <Link key={component.id} href={getComponentHref(component)}>
                <span className="component-manifest__numeral" aria-hidden="true">
                  {getComponentNumeral(component.id)}
                </span>
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
              <span className="component-manifest__numeral" aria-hidden="true">
                {getCategoryNumeral(item.slug)}
              </span>
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

/**
 * Catalog-wide search shared by every category route. It reuses the public
 * Command primitives instead of a bespoke result list so the Explorer exercises
 * the same keyboard contract it documents.
 */
function ComponentSearchDialog({
  open,
  onOpenChange,
  onSelectInCategory,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInCategory: (component: ComponentCatalogItem) => void;
  category: ComponentCategorySlug;
}) {
  const router = useRouter();

  const select = (component: ComponentCatalogItem) => {
    onOpenChange(false);
    if (component.category === category) {
      onSelectInCategory(component);
      return;
    }
    router.push(getComponentHref(component));
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search components"
      description="Jump to any component in the Allfit One React catalog."
    >
      <Command label="Search components" loop>
        <CommandInput placeholder="Search by name, contract or import…" />
        <CommandList>
          <CommandEmpty>No components match this search.</CommandEmpty>
          {componentCategories.map((item) => (
            <CommandGroup key={item.slug} heading={`${getCategoryNumeral(item.slug)} · ${item.label}`}>
              {item.components.map((component) => (
                <CommandItem
                  key={component.id}
                  value={`${component.title} ${component.id} ${component.importPath} ${component.contract.join(" ")}`}
                  onSelect={() => select(component)}
                >
                  <FoundationIcon name={item.icon} decorative />
                  <span>{component.title}</span>
                  <CommandShortcut>{getComponentNumeral(component.id)}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

export function ComponentCategoryNavigator({ category }: { category: ComponentCategorySlug }) {
  const router = useRouter();
  const categoryMeta = getComponentCategory(category);
  const [activeId, setActiveId] = useState(categoryMeta.components[0]?.id ?? "");
  const [searchOpen, setSearchOpen] = useState(false);
  const globalIndex = componentCatalogItems.findIndex((component) => component.id === activeId);
  const previous = globalIndex > 0 ? componentCatalogItems[globalIndex - 1] : undefined;
  const next = globalIndex >= 0 ? componentCatalogItems[globalIndex + 1] : undefined;
  const activeComponent = categoryMeta.components.find((component) => component.id === activeId);

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
        // The band can hold the tail of one entry and the head of the next.
        // The deepest one is the entry the reader has just moved into, so
        // taking the first would keep announcing the section already left.
        const intersecting = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const visible = intersecting[intersecting.length - 1];
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

  // "/" rather than Ctrl+K: the Command specimen documents Ctrl+K as its own
  // contract, and the Explorer must not shadow the component it is showing.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable) return;
      if (target?.closest("input, textarea, select, [role='dialog']")) return;

      event.preventDefault();
      setSearchOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const goToComponent = useCallback((component: ComponentCatalogItem) => {
    window.history.pushState(null, "", `#${component.id}`);
    setActiveId(component.id);
    focusComponent(
      component.id,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    );
  }, []);

  const renderStep = (component: ComponentCatalogItem | undefined, direction: "back" | "forward") => {
    const label = direction === "back" ? "Previous component" : "Next component";

    if (!component) {
      return (
        <IconButton variant="outline" size="icon-sm" aria-label={`${label} unavailable`} disabled>
          <FoundationIcon name={direction} decorative />
        </IconButton>
      );
    }

    return (
      <Link
        href={getComponentHref(component)}
        className={buttonVariants({ variant: "outline", size: "icon-sm" })}
        aria-label={`${label}: ${component.title}`}
        onClick={(event) => {
          if (component.category !== category) return;
          event.preventDefault();
          goToComponent(component);
        }}
      >
        <FoundationIcon name={direction} decorative />
      </Link>
    );
  };

  return (
    <nav className="component-local-nav" aria-label={`${categoryMeta.label} component navigation`}>
      <div className="component-local-nav__location">
        <span className="component-local-nav__numeral" aria-hidden="true">
          {activeComponent ? getComponentNumeral(activeComponent.id) : getCategoryNumeral(category)}
        </span>
        <span className="component-local-nav__breadcrumb">
          <span>Viewing</span>
          <strong>{activeComponent?.title ?? categoryMeta.label}</strong>
        </span>
      </div>

      <Select
        value={category}
        onValueChange={(value) => router.push(`/components/${value}`)}
      >
        <SelectTrigger
          className="component-local-nav__category"
          aria-label="Component category"
        >
          <SelectValue>
            {(value: ComponentCategorySlug) => getComponentCategory(value).label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categories</SelectLabel>
            {componentCategories.map((item) => (
              <SelectItem key={item.slug} value={item.slug}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="component-local-nav__search-trigger"
        onClick={() => setSearchOpen(true)}
      >
        <FoundationIcon name="search" data-icon="inline-start" decorative />
        <span>Search components</span>
        <CommandShortcut>/</CommandShortcut>
      </Button>

      <div className="component-local-nav__sequence">
        {renderStep(previous, "back")}
        {renderStep(next, "forward")}
      </div>

      <ComponentSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelectInCategory={goToComponent}
        category={category}
      />
    </nav>
  );
}
