import type { DocsSidebarNavData } from "../types/configDataTypes";

/**
 * Combined sidebar navigation data for the English locale
 */
const sidebarNavData: DocsSidebarNavData = {
	/**
	 * Ordered list of sidebar sections within each documentation tab
	 * The order here determines the display order in navigation.
	 * If a section does not exist for a given tab, it will be hidden.
	 */
	sections: [
		{
			id: "getting-started",
			title: "Getting Started",
		},
		{
			id: "components",
			title: "Components",
		},
		{
			id: "reference",
			title: "Reference",
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
			description: "Main documentation",
			icon: "tabler/file-text",
		},
		{
			id: "api",
			title: "API Reference",
			description: "API documentation",
			icon: "tabler/api-app",
		},
		{
			id: "tutorials",
			title: "Tutorials",
			description: "Step-by-step tutorials",
			icon: "tabler/school",
		},
	],
};

export default sidebarNavData;
