import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComponentCatalog } from "@/components/component-catalog";
import { ComponentCategoryNavigator } from "@/components/component-explorer-tools";
import {
  DesignSystemFooter,
  DesignSystemLayout,
} from "@/components/design-system-shell";
import {
  componentCategorySlugs,
  getComponentCategory,
  isComponentCategorySlug,
} from "@/lib/component-catalog";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return componentCategorySlugs.map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isComponentCategorySlug(category)) return {};

  const metadata = getComponentCategory(category);
  return {
    title: `${metadata.label} components | Allfit One Design System`,
    description: metadata.description,
  };
}

export default async function ComponentCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  if (!isComponentCategorySlug(category)) notFound();

  const metadata = getComponentCategory(category);

  return (
    <DesignSystemLayout
      current="components"
      id="category-top"
      className="design-system-workspace component-guide component-category-guide"
      label={metadata.label}
      homeHref="/components"
      topHref={`#${metadata.slug}`}
      skipHref={`#${metadata.components[0]?.id ?? metadata.slug}`}
      skipLabel={`Skip to ${metadata.label} components`}
    >
      <div className="design-system-content component-guide__content">
        <ComponentCatalog
          category={metadata.slug}
          navigation={<ComponentCategoryNavigator category={metadata.slug} />}
        />
        <DesignSystemFooter label={`${metadata.label} components`} />
      </div>
    </DesignSystemLayout>
  );
}
