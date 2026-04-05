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
      instructor: "Manish Jain",
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
      instructor: "Ramprasad Saptharishi",
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
      instructor: "Daniel Lokshtanov",
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
      instructor: "Ipsa Jain",
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
      instructor: "Siddharth Kankaria",
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
      instructor: "Neeldhara Misra and Shashank Srikant",
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
      instructor: "Venkata Koppula",
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
      instructor: "Priyansh Agarwal",
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
      instructor: "Neeldhara Misra and Aditya Nema",
      icon: "tabler/bulb",
      sections: [
        {
          id: "information-theory",
          title: "Classical Information Theory",
        },
      ],
    },

    {
      id: "kasuti-embroidery",
      group: "recreational-math",
      title: "2026 · Poems and Pixels",
      description: "An introduction to Kasuti embroidery as both craft and contemplative practice",
      instructor: "Priyamvada Trivedi",
      icon: "tabler/flame",
      sections: [
        {
          id: "kasuti-embroidery",
          title: "2026 · Poems and Pixels",
        },
      ],
    },
  ],
};

export default sidebarNavData;
