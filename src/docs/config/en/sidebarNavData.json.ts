import type { DocsSidebarNavData } from "../types/configDataTypes";

/**
 * Combined sidebar navigation data for the English locale
 */
const sidebarNavData: DocsSidebarNavData = {
  /**
   * Documentation tabs configuration
   * Organized by theme: recreational-math, schools, scicomm, other
   */
  tabs: [
    {
      id: "recreational-math",
      title: "Recreational Math",
      description: "Fun explorations of mathematics",
      icon: "tabler/flame",
      sections: [
        {
          id: "cards-combinatorics-1",
          title: "Cards and Combinatorics",
        },
        {
          id: "cards-combinatorics-2",
          title: "Card Magic",
        },
      ],
    },
    {
      id: "schools",
      title: "Schools",
      description: "GIAN courses and intensive programs",
      icon: "tabler/school",
      sections: [
        {
          id: "gian",
          title: "Randomized Methods for Parameterized Algorithms",
        },
      ],
    },
    {
      id: "scicomm",
      title: "Science Communication",
      description: "Science communication courses",
      icon: "tabler/edit-circle",
      sections: [
        {
          id: "visual-scicomm",
          title: "Visual Science Communication",
        },
        {
          id: "fundamentals-scicomm",
          title: "Fundamentals of SciComm",
        },
      ],
    },
    {
      id: "cs-research-101",
      title: "CS Research 101",
      description: "Getting started with research in Computer Science",
      icon: "tabler/file-text",
      sections: [
        {
          id: "cs-research-101",
          title: "CS Research 101",
        },
      ],
    },
    {
      id: "other",
      title: "Other",
      description: "Workshops and miscellaneous offerings",
      icon: "tabler/bulb",
      sections: [
        {
          id: "crypto",
          title: "Modern Cryptography",
        },
        {
          id: "dp-bootcamp",
          title: "DP Bootcamp",
        },
      ],
    },
  ],
};

export default sidebarNavData;
