/**
 * * Configuration of the i18n system data files and text translations
 */

/**
 * * Data file configuration for the i18n system
 * Every {Data} key must exist in the below object
 */
import navDataEn from "./en/navData.json";
import sidebarNavDataEn from "./en/sidebarNavData.json";
import siteDataEn from "./en/siteData.json";
import testimonialDataEn from "./en/testimonialData.json";

export const dataTranslations = {
  en: {
    siteData: siteDataEn,
    navData: navDataEn,
    sidebarNavData: sidebarNavDataEn,
    testimonialData: testimonialDataEn,
  },
} as const;

/**
 * * Text translations are used with the `useTranslation` function from src/js/i18nUtils.ts to translate various strings on your site.
 */
export const textTranslations = {
  en: {
    hero_description: `Short courses, workshops, and miscellaneous teaching offerings.`,
    back_to_all_posts: "Back to all posts",
  },
} as const;

/**
 * * Route translations are used to translate route names for the language switcher component
 */
export const routeTranslations = {
  en: {
    overviewKey: "overview",
    docsKey1: "docs",
    docsKey2: "docs/*",
    docsKey3: "docs",
  },
} as const;

/**
 * * Content collection translations used by the language switcher and hreflang generator
 */
export const localizedCollections = {
  docs: {
    en: "docs",
  },
} as const;
