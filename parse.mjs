#!/usr/bin/env node

/**
 * Obsidian -> Astro Parser for Short Courses & Miscellany
 *
 * Reads public.md files from the Obsidian vault and generates
 * Astro-compatible markdown files for the documentation site.
 *
 * Usage:
 *   node parse.mjs [--vault <path>] [--out <path>] [--dry-run]
 *
 * Defaults:
 *   --vault  /Users/neeldhara/repos/nm-obsidian/teaching/miscellany
 *   --out    ./src/docs/data/docs/en
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CLI args ──
const args = process.argv.slice(2);
function flag(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}
const dryRun = args.includes("--dry-run");

const DEFAULT_VAULT = "/Users/neeldhara/repos/nm-obsidian/teaching/miscellany";
const VAULT = flag("vault", DEFAULT_VAULT);
const OUT = path.resolve(__dirname, flag("out", "./src/docs/data/docs/en"));
const PUBLIC = path.resolve(__dirname, "./public/images/docs");

// ── Helpers ──
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Expand flat dash-separated keys to nested objects ──
// Converts "format-html-css: styles.css" to { format: { html: { css: "styles.css" } } }
function expandFlatKeys(obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (key.includes('-')) {
      const parts = key.split('-');
      let current = result;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = value;
    } else {
      result[key] = value;
    }
  }

  return result;
}

function log(msg) {
  console.log(`[parse] ${msg}`);
}

function logDry(msg) {
  if (dryRun) console.log(`[DRY-RUN] ${msg}`);
}

// ── Quarto callout transformer ──
// Converts Quarto callouts (:::{.callout-type}...:::) to Obsidian format first
function transformQuartoCallouts(md) {
  // Match Quarto callout blocks: :::{.callout-type ...}\ncontent\n:::
  const quartoPattern = /::+\{\.callout-(\w+)[^}]*\}\s*\n([\s\S]*?)\n::+/g;

  return md.replace(quartoPattern, (match, type, content) => {
    // Convert to Obsidian format
    const lines = content.trim().split('\n');
    const obsidianLines = lines.map(line => `> ${line}`);
    return `> [!${type}]\n${obsidianLines.join('\n')}`;
  });
}

// ── Callout transformer ──
// Converts Obsidian callouts to HTML elements
function transformCallouts(md) {
  const lines = md.split("\n");
  const out = [];
  let inCallout = false;
  let calloutType = "";
  let calloutTitle = "";
  let calloutBody = [];
  let calloutCollapsible = false;
  let calloutDefaultOpen = false;

  const typeMap = {
    note: "note",
    tip: "tip",
    warning: "caution",
    caution: "caution",
    danger: "danger",
    important: "tip",
    example: "note",
    question: "note",
    info: "note",
  };

  function flushCallout() {
    if (!inCallout) return;
    const body = calloutBody.join("\n").trim();
    const cssType = typeMap[calloutType] || "note";
    const hasTitle = calloutTitle && calloutTitle.trim().length > 0;

    if (calloutCollapsible) {
      const openAttr = calloutDefaultOpen ? " open" : "";
      out.push(`<details class="callout callout-${cssType}"${openAttr}>`);
      if (hasTitle) {
        out.push(`<summary class="callout-title">${calloutTitle}</summary>`);
      } else {
        out.push(`<summary class="callout-title callout-title-hidden"></summary>`);
      }
      out.push(`<div class="callout-body">\n\n${body}\n\n</div>`);
      out.push(`</details>\n`);
    } else {
      out.push(`<div class="callout callout-${cssType}">`);
      if (hasTitle) {
        out.push(`<div class="callout-title">${calloutTitle}</div>`);
      }
      out.push(`<div class="callout-body">\n\n${body}\n\n</div>`);
      out.push(`</div>\n`);
    }

    inCallout = false;
    calloutType = "";
    calloutTitle = "";
    calloutBody = [];
    calloutCollapsible = false;
    calloutDefaultOpen = false;
  }

  for (const line of lines) {
    const calloutStart = line.match(/^>\s*\[!(\w+)\]([+-])?\s*(.*)/);
    if (calloutStart) {
      flushCallout();
      inCallout = true;
      calloutType = calloutStart[1].toLowerCase();
      const collapseMark = calloutStart[2];
      calloutTitle = calloutStart[3].trim();

      if (collapseMark === '-') {
        calloutCollapsible = true;
        calloutDefaultOpen = false;
      } else if (collapseMark === '+') {
        calloutCollapsible = true;
        calloutDefaultOpen = true;
      } else {
        calloutCollapsible = false;
        calloutDefaultOpen = false;
      }
      continue;
    }

    if (inCallout && line.startsWith("> ")) {
      calloutBody.push(line.slice(2));
      continue;
    }
    if (inCallout && line === ">") {
      calloutBody.push("");
      continue;
    }

    if (inCallout) {
      flushCallout();
    }

    out.push(line);
  }

  flushCallout();
  return out.join("\n");
}

// ── Image embed transformer ──
// Converts Obsidian image embeds ![[image.jpg|size]] to standard markdown
// Also tracks images that need to be copied
const imagesToCopy = new Map(); // source -> destination mapping

function transformImageEmbeds(md, sectionName) {
  // Match Obsidian image embeds: ![[filename.ext|optional-size]]
  const imagePattern = /!\[\[([^\]|]+\.(jpg|jpeg|png|gif|svg|webp))(?:\|(\d+))?\]\]/gi;

  return md.replace(imagePattern, (match, filename, ext, size) => {
    // Track the image for copying
    imagesToCopy.set(`${sectionName}/${filename}`, { filename, sectionName });

    // Generate standard markdown image with path to public folder
    const imgPath = `/images/docs/${sectionName}/${filename}`;
    if (size) {
      return `<img src="${imgPath}" alt="${filename}" style="width: ${size}px; max-width: 100%;" />`;
    }
    return `![${filename}](${imgPath})`;
  });
}

// ── Wikilink transformer ──
function transformWikilinks(md, currentSection) {
  return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, file, display) => {
    const text = display || file;

    // Handle anchors in wikilinks: [[file#anchor|text]]
    let slug, anchor = '';
    if (file.includes('#')) {
      const [filePart, anchorPart] = file.split('#');
      slug = filePart.replace(/\.md$/, "").split("/").pop();
      anchor = `#${anchorPart}`;
    } else {
      slug = file.replace(/\.md$/, "").split("/").pop();
    }

    return `[${text}](./${slug}/${anchor})`;
  });
}

// ── Heading anchor transformer ──
// Converts Pandoc/Quarto heading anchors {#anchor-id} to HTML with id attribute
function transformHeadingAnchors(md) {
  // Match headings with {#anchor-id} at the end
  return md.replace(/^(#{1,6})\s+(.+?)\s*\{#([a-zA-Z0-9_-]+)\}\s*$/gm, (match, hashes, title, anchorId) => {
    const level = hashes.length;
    return `<h${level} id="${anchorId}">${title.trim()}</h${level}>`;
  });
}

// ── Transform relative .md links to directory format ──
function transformRelativeLinks(md) {
  // Convert [text](file.md) to [text](file/) for local .md files
  return md.replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, (match, text, href) => {
    // Skip external links
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return match;
    }
    // Convert .md to / for Astro routing
    const newHref = href.replace(/\.md$/, '/');
    return `[${text}](${newHref})`;
  });
}

// ── Main transformer pipeline ──
function transformMarkdown(md, currentSection) {
  let result = md;
  result = transformQuartoCallouts(result);  // Convert Quarto to Obsidian first
  result = transformCallouts(result);         // Then convert Obsidian to HTML
  result = transformHeadingAnchors(result);   // Convert {#anchor-id} headings
  result = transformImageEmbeds(result, currentSection); // Handle image embeds
  result = transformWikilinks(result, currentSection);
  result = transformRelativeLinks(result);
  result = result.replace(/\n{3,}/g, "\n\n");
  return result;
}

// ── Convert object to YAML string with indentation ──
function objectToYaml(obj, indent = 0) {
  let yaml = "";
  const spaces = "  ".repeat(indent);

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (typeof value === "object" && !Array.isArray(value)) {
      yaml += `${spaces}${key}:\n`;
      yaml += objectToYaml(value, indent + 1);
    } else if (typeof value === "string") {
      // Coerce numeric strings to numbers (e.g. sidebar-order: "1" → order: 1)
      if (/^\d+$/.test(value)) {
        yaml += `${spaces}${key}: ${parseInt(value, 10)}\n`;
      } else {
        yaml += `${spaces}${key}: "${value}"\n`;
      }
    } else if (typeof value === "boolean" || typeof value === "number") {
      yaml += `${spaces}${key}: ${value}\n`;
    }
  }

  return yaml;
}

// ── Generate frontmatter YAML ──
function generateFrontmatter(data) {
  // Expand flat dash-separated keys to nested objects
  const expanded = expandFlatKeys(data);

  let yaml = "---\n";

  // Required fields
  yaml += `title: "${expanded.title || 'Untitled'}"\n`;
  yaml += `showTitle: false\n`;

  if (expanded.description) {
    yaml += `description: "${expanded.description}"\n`;
  }

  if (expanded.theme) {
    yaml += `theme: "${expanded.theme}"\n`;
  }

  if (expanded.section) {
    yaml += `section: "${expanded.section}"\n`;
  }

  // Sidebar configuration - always add "Overview" label for index pages
  yaml += `sidebar:\n`;
  yaml += `  label: "Overview"\n`;
  if (expanded.sidebar && typeof expanded.sidebar === "object") {
    // Add any other sidebar properties from source (excluding label which we override)
    const { label, ...rest } = expanded.sidebar;
    if (Object.keys(rest).length > 0) {
      yaml += objectToYaml(rest, 1);
    }
  }

  // Format configuration (from flat keys like format-html-css)
  if (expanded.format) {
    yaml += `format:\n`;
    yaml += objectToYaml(expanded.format, 1);
  }

  yaml += "---\n\n";
  return yaml;
}

// ── Generate frontmatter for subpages ──
// For one-off courses, show in sidebar; otherwise hide
// Respects explicit sidebar.hidden: true from source frontmatter
function generateSubpageFrontmatter(data, title, options = {}) {
  const { isOneOff = false, sidebarOrder = 99, sidebarLabel = null, sourceSidebar = null } = options;

  let yaml = "---\n";
  yaml += `title: "${data.title || title || 'Untitled'}"\n`;
  yaml += `showTitle: false\n`;
  if (data.description) {
    yaml += `description: "${data.description}"\n`;
  }
  if (data.theme) {
    yaml += `theme: "${data.theme}"\n`;
  }
  if (data.section) {
    yaml += `section: "${data.section}"\n`;
  }

  // Sidebar configuration - respect explicit hidden flag from source
  const isHidden = sourceSidebar && typeof sourceSidebar === 'object' && sourceSidebar.hidden === true;

  if (isHidden) {
    yaml += `sidebar:\n  hidden: true\n`;
  } else if (isOneOff) {
    yaml += `sidebar:\n`;
    if (sidebarLabel) {
      yaml += `  label: "${sidebarLabel}"\n`;
    }
    yaml += `  order: ${sidebarOrder}\n`;
  } else {
    yaml += `sidebar:\n  hidden: true\n`;
  }

  yaml += "---\n\n";
  return yaml;
}

// ── Process a single .md file ──
function processFile(filePath, sectionName, options = {}) {
  const { isIndex = false, parentFrontmatter = null, isOneOff = false, subpageOrder = 99 } = options;

  const content = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content: body } = matter(content);

  // Transform the body
  const transformedBody = transformMarkdown(body, sectionName);

  // Generate output
  let output;
  if (isIndex) {
    output = generateFrontmatter(frontmatter) + transformedBody;
  } else {
    // For subpages, inherit theme/section from parent and extract title from first heading
    // Check for any heading level (# through ######)
    const titleMatch = body.match(/^#{1,6}\s+(.+)$/m);
    const title = frontmatter.title || (titleMatch ? titleMatch[1] : path.basename(filePath, '.md'));
    const mergedFrontmatter = {
      ...parentFrontmatter,
      ...frontmatter,
      title,
    };

    // Support flat sidebar keys from Obsidian: sidebar-order, sidebar-label, sidebar-hidden
    const expandedFm = expandFlatKeys(frontmatter);
    const sidebarConfig = expandedFm.sidebar || frontmatter.sidebar || {};
    const sidebarObj = typeof sidebarConfig === 'object' ? sidebarConfig : {};

    // Determine sidebar order: explicit sidebar-order > auto from subpageOrder
    const explicitOrder = sidebarObj.order !== undefined ? parseInt(sidebarObj.order, 10) : undefined;
    const finalOrder = explicitOrder !== undefined ? explicitOrder : subpageOrder;

    // Generate sidebar label: explicit sidebar-label > frontmatter title > module pattern > heading > filename
    const filename = path.basename(filePath, '.md');
    const moduleMatch = filename.match(/^m(\d+)$/);
    const sidebarLabel = sidebarObj.label || (moduleMatch ? `Module ${moduleMatch[1]}` : title);

    output = generateSubpageFrontmatter(mergedFrontmatter, title, {
      isOneOff,
      sidebarOrder: finalOrder,
      sidebarLabel: isOneOff ? sidebarLabel : null,
      sourceSidebar: sidebarObj,
    }) + transformedBody;
  }

  return output;
}

// ── Update sidebarNavData.json.ts with vault titles/descriptions ──
function updateSidebarNavData(folders) {
  const sidebarNavPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "src/docs/config/en/sidebarNavData.json.ts"
  );

  if (!fs.existsSync(sidebarNavPath)) {
    log(`  Warning: sidebarNavData.json.ts not found, skipping update`);
    return;
  }

  let content = fs.readFileSync(sidebarNavPath, "utf-8");
  let updated = false;

  for (const folder of folders) {
    const sectionName = folder.name;
    const publicMdPath = path.join(VAULT, sectionName, "public.md");
    if (!fs.existsSync(publicMdPath)) continue;

    const { data: fm } = matter(fs.readFileSync(publicMdPath, "utf-8"));
    const title = (fm.title || "").replace(/^"|"$/g, "");
    const description = (fm.description || "").replace(/^"|"$/g, "");

    if (!title) continue;

    // Update tab title: match id line then the title line after it
    // Pattern: id: "sectionName",\n      group: "...",\n      title: "...",
    const tabTitleRegex = new RegExp(
      `(id: "${sectionName}",\\n\\s+group: "[^"]*",\\n\\s+title: )"[^"]*"`,
    );
    if (tabTitleRegex.test(content)) {
      const before = content;
      content = content.replace(tabTitleRegex, `$1"${title}"`);
      if (content !== before) {
        log(`  Updated tab title for ${sectionName}: "${title}"`);
        updated = true;
      }
    }

    // Update section title (inside sections array)
    const sectionTitleRegex = new RegExp(
      `(id: "${sectionName}",\\n\\s+title: )"[^"]*"(,?\\n\\s+\\})`,
    );
    if (sectionTitleRegex.test(content)) {
      const before = content;
      content = content.replace(sectionTitleRegex, `$1"${title}"$2`);
      if (content !== before) updated = true;
    }

    // Update description if present in vault
    if (description) {
      const descRegex = new RegExp(
        `(id: "${sectionName}",\\n\\s+group: "[^"]*",\\n\\s+title: "[^"]*",\\n\\s+description: )"[^"]*"`,
      );
      if (descRegex.test(content)) {
        const before = content;
        content = content.replace(descRegex, `$1"${description}"`);
        if (content !== before) {
          log(`  Updated description for ${sectionName}`);
          updated = true;
        }
      }
    }
  }

  if (updated && !dryRun) {
    fs.writeFileSync(sidebarNavPath, content, "utf-8");
    log(`\nUpdated sidebarNavData.json.ts`);
  } else if (updated && dryRun) {
    logDry(`Would update sidebarNavData.json.ts`);
  }
}

// ── Main ──
function main() {
  log(`Starting parse...`);
  log(`Vault: ${VAULT}`);
  log(`Output: ${OUT}`);
  if (dryRun) log(`DRY RUN - no files will be written`);

  if (!fs.existsSync(VAULT)) {
    console.error(`Vault not found: ${VAULT}`);
    process.exit(1);
  }

  // Get all subdirectories in the vault
  const entries = fs.readdirSync(VAULT, { withFileTypes: true });
  const folders = entries.filter(e => e.isDirectory() && !e.name.startsWith("."));
  const vaultFolderNames = new Set(folders.map(f => f.name));

  // Clean up output folders that no longer exist in vault
  if (fs.existsSync(OUT)) {
    const outEntries = fs.readdirSync(OUT, { withFileTypes: true });
    const outFolders = outEntries.filter(e => e.isDirectory() && !e.name.startsWith("."));

    for (const outFolder of outFolders) {
      if (!vaultFolderNames.has(outFolder.name)) {
        const stalePath = path.join(OUT, outFolder.name);
        if (dryRun) {
          logDry(`Would remove stale folder: ${stalePath}`);
        } else {
          log(`  Removing stale folder: ${outFolder.name}`);
          fs.rmSync(stalePath, { recursive: true, force: true });
        }
      }
    }
  }

  log(`Found ${folders.length} course folders`);

  let processedCount = 0;

  for (const folder of folders) {
    const sectionName = folder.name;
    const folderPath = path.join(VAULT, sectionName);
    const publicMdPath = path.join(folderPath, "public.md");

    if (!fs.existsSync(publicMdPath)) {
      log(`  Skipping ${sectionName} (no public.md)`);
      continue;
    }

    // Get frontmatter from public.md to inherit theme/section
    const publicContent = fs.readFileSync(publicMdPath, "utf-8");
    const { data: parentFrontmatter } = matter(publicContent);

    // Default section and theme to folder name if not set
    // With 3-level nesting, each course folder is its own tab,
    // so section must equal the folder name for sidebar routing.
    // theme must equal the folder name for subpages to be visible.
    if (!parentFrontmatter.section || parentFrontmatter.section !== sectionName) {
      if (parentFrontmatter.section && parentFrontmatter.section !== sectionName) {
        log(`    Warning: section "${parentFrontmatter.section}" overridden to "${sectionName}" (must match folder name)`);
      }
      parentFrontmatter.section = sectionName;
    }
    if (!parentFrontmatter.theme) {
      parentFrontmatter.theme = sectionName;
    }

    // With the 3-level nesting model, all courses are one-off by default
    const isOneOff = true;
    log(`  Processing: ${sectionName}/public.md`);

    // Process main index page
    const output = processFile(publicMdPath, sectionName, { isIndex: true });
    const outDir = path.join(OUT, sectionName);
    const outFile = path.join(outDir, "index.md");

    if (dryRun) {
      logDry(`Would write: ${outFile}`);
      logDry(`Content preview (first 200 chars):\n${output.slice(0, 200)}...`);
    } else {
      ensureDir(outDir);
      fs.writeFileSync(outFile, output, "utf-8");
      log(`    -> ${outFile}`);
    }

    processedCount++;

    // Process additional .md files (not public.md or host.md)
    const mdFiles = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.md') && f !== 'public.md' && f !== 'host.md')
      .sort(); // Sort for consistent ordering

    mdFiles.forEach((mdFile, index) => {
      const mdPath = path.join(folderPath, mdFile);
      const subOutput = processFile(mdPath, sectionName, {
        isIndex: false,
        parentFrontmatter,
        isOneOff,
        subpageOrder: index + 1, // Start from 1 (index 0 is the main page)
      });
      const subOutFile = path.join(outDir, mdFile);

      if (dryRun) {
        logDry(`Would write: ${subOutFile}`);
      } else {
        fs.writeFileSync(subOutFile, subOutput, "utf-8");
        log(`    -> ${subOutFile}`);
      }

      processedCount++;
    });
  }

  log(`\nProcessed ${processedCount} files`);

  // Update sidebarNavData.json.ts with titles/descriptions from vault
  updateSidebarNavData(folders);

  // Copy images to public folder
  if (imagesToCopy.size > 0) {
    log(`\nCopying ${imagesToCopy.size} images...`);
    ensureDir(PUBLIC);

    for (const [key, { filename, sectionName }] of imagesToCopy) {
      const srcPath = path.join(VAULT, sectionName, filename);
      const destDir = path.join(PUBLIC, sectionName);
      const destPath = path.join(destDir, filename);

      if (fs.existsSync(srcPath)) {
        if (dryRun) {
          logDry(`Would copy: ${srcPath} -> ${destPath}`);
        } else {
          ensureDir(destDir);
          fs.copyFileSync(srcPath, destPath);
          log(`  Copied: ${sectionName}/${filename}`);
        }
      } else {
        log(`  Warning: Image not found: ${srcPath}`);
      }
    }
  }

  log(`\nDone!`);
}

main();
