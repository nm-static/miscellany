import type { DocSection } from "@/docs/config/types/configDataTypes";
import { getTranslatedData } from "./translationUtils";
import { locales, defaultLocale } from "@/docs/config/siteSettings.json";

type LocaleType = (typeof locales)[number];

// Cache for translated sections to avoid repeated data fetching
const sectionCache = new Map<LocaleType, DocSection[]>();

/**
 * Get translated sections data with caching
 */
const getTranslatedSections = (locale: LocaleType): DocSection[] => {
	if (!sectionCache.has(locale)) {
		sectionCache.set(locale, getTranslatedData("sidebarNavData", locale) as DocSection[]);
	}
	return sectionCache.get(locale)!;
};

/**
 * Get an array of section IDs in the order they should appear in navigation
 */
export const getOrderedSectionIds = (locale: LocaleType): string[] => {
	return getTranslatedSections(locale).map((section) => section.id);
};

/**
 * Get the section details by ID
 */
export const getSectionById = (id: string, locale: LocaleType): DocSection | undefined => {
	return getTranslatedSections(locale).find((section) => section.id === id);
};

/**
 * Get the title for a documentation section
 */
export const getSectionTitle = (id: string, locale: LocaleType): string => {
	const section = getSectionById(id, locale);
	if (section?.title) return section.title;

	// Fallback to title case if section not found
	return id
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};
