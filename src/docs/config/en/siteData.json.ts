import type { DocsSiteData } from "../types/configDataTypes";

const docsSiteData: DocsSiteData = {
  title: "Short Courses and Miscellany",
  description:
    "Short courses, workshops, and miscellaneous teaching offerings by Neeldhara Misra.",
  navSocials: [
    {
      social: "GitHub",
      link: "https://github.com/neeldhara",
      icon: "tabler/brand-github",
    },
  ],
  footerSocials: [
    {
      social: "GitHub",
      link: "https://github.com/neeldhara",
      icon: "tabler/brand-github",
    },
  ],
  // default image for meta tags if the page doesn't have an image already
  defaultImage: {
    src: "/images/default-og.png",
    alt: "Short Courses and Miscellany",
  },
  // Your information for SEO purposes
  author: {
    name: "Neeldhara Misra",
    email: "neeldhara.m@iitgn.ac.in",
    twitter: "neaborern",
  },
};

export default docsSiteData;
