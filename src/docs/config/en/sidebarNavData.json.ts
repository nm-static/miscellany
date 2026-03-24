import type { DocsSidebarNavData } from "../types/configDataTypes";

/**
 * Combined sidebar navigation data for the English locale
 *
 * Each course is its own tab (box in the sidebar).
 * The `group` field maps tabs to top-nav categories.
 */
const sidebarNavData: DocsSidebarNavData = {
  tabs: [
    // ── Recreational Math ──
    {
      id: "cards-combinatorics-1",
      group: "recreational-math",
      title: "2019 · Card Magic",
      description: "Exploring mathematics through card tricks",
      icon: "tabler/flame",
      sections: [
        {
          id: "cards-combinatorics-1",
          title: "2019 · Card Magic",
        },
      ],
    },
    {
      id: "cards-combinatorics-2",
      group: "recreational-math",
      title: "2025 · Card Magic",
      description: "Exploring mathematics through card tricks",
      icon: "tabler/flame",
      sections: [
        {
          id: "cards-combinatorics-2",
          title: "2025 · Card Magic",
        },
      ],
    },

    // ── Schools ──
    {
      id: "gian",
      group: "schools",
      title: "Randomized Methods for Parameterized Algorithms",
      description: "GIAN Course on Randomized Methods for Parameterized Algorithms",
      icon: "tabler/school",
      sections: [
        {
          id: "gian",
          title: "Randomized Methods for Parameterized Algorithms",
        },
      ],
    },

    // ── Science Communication ──
    {
      id: "visual-scicomm",
      group: "scicomm",
      title: "Visual Science Communication",
      description: "Communicating science through visual media",
      icon: "tabler/edit-circle",
      sections: [
        {
          id: "visual-scicomm",
          title: "Visual Science Communication",
        },
      ],
    },
    {
      id: "fundamentals-scicomm",
      group: "scicomm",
      title: "Fundamentals of Science Communication",
      description: "Core principles of effective science communication",
      icon: "tabler/edit-circle",
      sections: [
        {
          id: "fundamentals-scicomm",
          title: "Fundamentals of Science Communication",
        },
      ],
    },

    // ── Soft Skills ──
    {
      id: "cs-research-101",
      group: "soft-skills",
      title: "CS Research 101",
      description: "A short and mildly opinionated course for anyone curious about getting started with research in Computer Science",
      icon: "tabler/file-text",
      sections: [
        {
          id: "cs-research-101",
          title: "CS Research 101",
        },
      ],
    },

    // ── Other ──
    {
      id: "crypto",
      group: "other",
      title: "Modern Cryptography",
      description: "A nano-course in modern cryptography",
      icon: "tabler/bulb",
      sections: [
        {
          id: "crypto",
          title: "Modern Cryptography",
        },
      ],
    },
    {
      id: "dp-bootcamp",
      group: "other",
      title: "Dynamic Programming Bootcamp",
      description: "An intensive bootcamp on dynamic programming techniques",
      icon: "tabler/bulb",
      sections: [
        {
          id: "dp-bootcamp",
          title: "Dynamic Programming Bootcamp",
        },
      ],
    },
    {
      id: "information-theory",
      group: "other",
      title: "Classical Information Theory",
      description: "Classical Information Theory",
      icon: "tabler/bulb",
      sections: [
        {
          id: "information-theory",
          title: "Classical Information Theory",
        },
      ],
    },
  ],
};

export default sidebarNavData;
