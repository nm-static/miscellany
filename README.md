# Miscellany — Short Courses & Workshops

An Astro documentation site for miscellaneous teaching offerings, built with the Pathfinder theme. Content is authored in Obsidian and parsed into Astro-compatible markdown.

## Architecture: 3-Level Nesting

The site uses a 3-level navigation hierarchy:

```
Top Nav (group)          e.g. "Recreational Math", "Schools", "Soft Skills"
  └── Sidebar Box (tab)  e.g. "Cards and Combinatorics", "Card Magic"
        └── Pages         e.g. "Overview", "Module 1", "Module 2"
```

### Level 1: Groups (Top Nav)

Defined in `src/docs/config/en/navData.json.ts`. Each top nav item links to the first page of a course in that group.

### Level 2: Tabs (Sidebar Boxes)

Defined in `src/docs/config/en/sidebarNavData.json.ts`. Each course is a **tab** with:
- `id` — must match the course's folder name in the vault and in `src/docs/data/docs/en/`
- `group` — determines which top-nav category the tab belongs to
- `title`, `description`, `icon` — display metadata
- `sections` — sub-folder groupings within the course (typically just one matching the tab id)

Tabs with the same `group` appear together as clickable boxes in the sidebar.

### Level 3: Pages

Individual markdown files inside each course folder. Each page's frontmatter `section` field must match its tab `id`.

## Obsidian Vault Structure

The vault lives at `/Users/neeldhara/repos/nm-obsidian/teaching/miscellany/` (configurable via `--vault` flag).

```
miscellany/
  course-name/
    public.md     ← main page (becomes index.md)
    host.md       ← excluded from parsing (private notes)
    topic-a.md    ← subpage (visible in sidebar)
    topic-b.md    ← subpage (visible in sidebar)
```

### Frontmatter Convention for `public.md`

```yaml
---
title: "Course Title"
description: "Brief description"
theme: "course-name"       # MUST equal the folder name
section: "course-name"     # MUST equal the folder name
sidebar:
  order: 1                 # optional: controls sort order
---
```

**Both `theme` and `section` must equal the folder name.** The parser enforces this by auto-defaulting both to the folder name (with a warning if overriding), so technically you can omit them — but setting them explicitly avoids confusion.

- `section` — tells Astro which sidebar tab this page belongs to
- `theme` — when it equals the folder name, all subpages (extra `.md` files) become visible in the sidebar

### Subpage Files

Any `.md` file in the course folder other than `public.md` and `host.md` is treated as a subpage:
- Subpages inherit `theme` and `section` from `public.md`
- They appear in the sidebar sorted alphabetically by filename
- Files named `mN.md` (e.g., `m1.md`, `m2.md`) get auto-labeled "Module N"
- Other files use the first `# Heading` as the sidebar label
- To hide a subpage from the sidebar, add `sidebar: { hidden: true }` to its frontmatter

## Parser

Run the parser to sync from Obsidian to the Astro site:

```bash
# Default (uses configured vault path)
node parse.mjs

# Custom vault path
node parse.mjs --vault /path/to/vault

# Preview without writing files
node parse.mjs --dry-run
```

The parser:
1. Reads each course folder's `public.md` as the index page
2. Processes additional `.md` files as subpages (excludes `host.md`)
3. Transforms Obsidian/Quarto callouts to HTML
4. Converts `![[image.jpg]]` embeds to standard markdown
5. Resolves `[[wikilinks]]` to relative URLs
6. Copies referenced images to `public/images/docs/`
7. Removes stale output folders that no longer exist in the vault
8. Auto-defaults `section` and `theme` to the folder name (warns if overriding)

## Adding a New Course

1. **Create the vault folder:** `miscellany/my-new-course/`

2. **Add `public.md`** with frontmatter:
   ```yaml
   ---
   title: "My New Course"
   description: "Description here"
   theme: "my-new-course"
   section: "my-new-course"
   ---
   ```

3. **Add a tab** in `src/docs/config/en/sidebarNavData.json.ts`:
   ```ts
   {
     id: "my-new-course",
     group: "existing-group",  // or a new group name
     title: "My New Course",
     icon: "tabler/some-icon",
     sections: [{ id: "my-new-course", title: "My New Course" }],
   },
   ```

4. **If creating a new group**, add it to `src/docs/config/en/navData.json.ts`:
   ```ts
   {
     text: "New Group Name",
     link: "/docs/my-new-course/",
   },
   ```

5. **Run the parser:** `node parse.mjs`

6. **Build:** `npm run build`

## Current Groups

| Group | Top Nav Label | Courses |
|-------|--------------|---------|
| `recreational-math` | Recreational Math | cards-combinatorics-1, cards-combinatorics-2 |
| `schools` | Schools | gian |
| `scicomm` | Science Communication | visual-scicomm, fundamentals-scicomm |
| `soft-skills` | Soft Skills | cs-research-101 |
| `other` | Other | crypto, dp-bootcamp |

## Key Files

| File | Purpose |
|------|---------|
| `parse.mjs` | Obsidian-to-Astro parser |
| `src/docs/config/en/navData.json.ts` | Top navigation links |
| `src/docs/config/en/sidebarNavData.json.ts` | Sidebar tabs with group assignments |
| `src/docs/config/types/configDataTypes.ts` | TypeScript types for config |
| `src/docs/js/docsUtils.ts` | Helper functions (getTabById, getTabsByGroup, etc.) |
| `src/docs/components/nav/SidebarNav.astro` | Sidebar rendering (filters tabs by group) |
| `src/content.config.ts` | Astro content collection schema |
| `src/docs/data/docs/en/` | Generated content (do not edit directly) |

## Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Production build to ./dist/
npm run preview      # Preview production build
```
