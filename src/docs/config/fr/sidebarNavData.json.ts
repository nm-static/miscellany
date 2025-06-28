import type { DocsSidebarNavData } from "../types/configDataTypes";

/**
 * Combined sidebar navigation data for the French locale
 */
const sidebarNavData: DocsSidebarNavData = {
	/**
	 * Ordered list of sidebar sections within each documentation tab
	 * The order here determines the display order in navigation
	 */
	sections: [
		{
			id: "getting-started",
			title: "Commencer",
		},
		{
			id: "components",
			title: "Composants",
		},
		{
			id: "reference",
			title: "Référence",
		},
	],

	/**
	 * Documentation tabs configuration
	 * These define the different top-level documentation section tabs
	 */
	tabs: [
		{
			id: "main",
			title: "Documentation",
			description: "Documentation principale",
			icon: "tabler/file-text",
		},
		{
			id: "api",
			title: "Référence API",
			description: "Documentation de l'API",
			icon: "tabler/api-app",
		},
		{
			id: "tutorials",
			title: "Tutoriels",
			description: "Tutoriels étape par étape",
			icon: "tabler/school",
		},
	],
};

export default sidebarNavData;
