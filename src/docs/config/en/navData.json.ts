/**
 * * This file is used to define the navigation links for the documentation site.
 * Links use the group name as the route prefix.
 */

// types
import { type navItem } from "../types/configDataTypes";

const navConfig: navItem[] = [
  {
    text: "Recreational Math",
    link: "/recreational-math/cards-combinatorics-1/",
  },
  {
    text: "Schools",
    link: "/schools/gian/",
  },
  {
    text: "Science Communication",
    link: "/scicomm/visual-scicomm/",
  },
  {
    text: "Soft Skills",
    link: "/soft-skills/cs-research-101/",
  },
  {
    text: "Other",
    link: "/other/crypto/",
  },
];

export default navConfig;
