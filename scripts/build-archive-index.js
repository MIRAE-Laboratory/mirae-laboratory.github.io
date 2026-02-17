/**
 * public/contents/archive/*.md 파일을 읽어 frontmatter를 추출하고
 * public/data/archive-index.json 을 생성합니다.
 * 빌드 전에 실행되므로 Archive 페이지는 이 인덱스를 사용합니다.
 *
 * .md 파일 frontmatter 필드 (선택):
 *   title, date, category, tags[], source, country, institute,
 *   correspondingAuthor, abstract, TLDR (3-line bullet), type, language, authors[]
 *   slug 를 넣지 않으면 파일명(확장자 제외)이 slug가 됩니다.
 */

const fs = require("fs");
const path = require("path");

const ARCHIVE_DIR = path.join(__dirname, "..", "public", "contents", "archive");
const OUT_FILE = path.join(__dirname, "..", "public", "data", "archive-index.json");

function parseFrontmatter(contents) {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: contents };
  const yaml = match[1];
  const body = match[2].trim();
  const frontmatter = {};
  const lines = yaml.split(/\r?\n/);
  let key = null;
  let arrayAcc = null;
  let multiLineKey = null;
  let multiLineLines = [];
  for (const line of lines) {
    if (multiLineKey !== null) {
      if (line.match(/^\s+\S/) || line.match(/^\s*-\s+/)) {
        multiLineLines.push(line.replace(/^\s+/, ""));
        continue;
      }
      frontmatter[multiLineKey] = multiLineLines.join("\n").trim();
      multiLineKey = null;
      multiLineLines = [];
    }
    const arrayItem = line.match(/^\s*-\s+(.+)$/);
    if (arrayItem) {
      if (arrayAcc) arrayAcc.push(arrayItem[1].replace(/^["']|["']$/g, ""));
      continue;
    }
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const raw = kv[2].trim();
      if (raw === "|" || raw === ">") {
        multiLineKey = key;
        multiLineLines = [];
        continue;
      }
      if (raw === "" && (key === "tags" || key === "category" || key === "authors" || key === "tldr")) {
        arrayAcc = [];
        frontmatter[key] = arrayAcc;
      } else if (raw.startsWith("[")) {
        try {
          frontmatter[key] = JSON.parse(raw.replace(/'/g, '"'));
        } catch {
          frontmatter[key] = raw;
        }
        arrayAcc = null;
      } else if (raw.startsWith('"') || raw.startsWith("'")) {
        frontmatter[key] = raw.slice(1, -1).replace(/\\"/g, '"');
        arrayAcc = null;
      } else {
        frontmatter[key] = raw;
        arrayAcc = null;
      }
      continue;
    }
  }
  if (multiLineKey !== null) {
    frontmatter[multiLineKey] = multiLineLines.join("\n").trim();
  }
  return { frontmatter, body };
}

function buildIndex() {
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, "[]", "utf8");
    console.log("contents/archive not found, wrote empty archive-index.json");
    return;
  }

  const files = fs.readdirSync(ARCHIVE_DIR).filter((f) => f.endsWith(".md"));
  const items = [];
  let id = 0;
  for (const file of files.sort()) {
    const slug = file.replace(/\.md$/i, "");
    const filePath = path.join(ARCHIVE_DIR, file);
    const contents = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = parseFrontmatter(contents);
    id += 1;
    items.push({
      id: frontmatter.id || `archive-${id}`,
      slug: frontmatter.slug || slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || "",
      category: frontmatter.category || null,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      authors: Array.isArray(frontmatter.authors) ? frontmatter.authors : [],
      source: frontmatter.source || null,
      country: frontmatter.country || null,
      institute: frontmatter.institute || null,
      correspondingAuthor: frontmatter.correspondingAuthor || null,
      abstract: (() => {
        const v = frontmatter.abstract || frontmatter.TLDR || frontmatter.tldr;
        return Array.isArray(v) ? v.join("\n") : (v || null);
      })(),
      TLDR: (() => {
        const v = frontmatter.TLDR || frontmatter.tldr;
        return Array.isArray(v) ? v.join("\n") : (v || null);
      })(),
      type: frontmatter.type || null,
      language: frontmatter.language || null,
    });
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(items, null, 2), "utf8");
  console.log(`Built archive-index.json: ${items.length} items from contents/archive/*.md`);
}

buildIndex();
