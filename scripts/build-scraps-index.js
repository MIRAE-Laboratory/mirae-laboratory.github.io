/**
 * public/content/scraps/*.md 파일을 읽어 frontmatter를 추출하고
 * public/data/scraps-index.json 을 생성합니다.
 * 빌드 전에 실행되므로 Archive 페이지는 이 인덱스를 사용합니다.
 *
 * .md 파일 frontmatter 필드 (선택):
 *   title, date, category, tags[], source, country, institute,
 *   correspondingAuthor, abstract, type, language
 *   slug 를 넣지 않으면 파일명(확장자 제외)이 slug가 됩니다.
 */

const fs = require("fs");
const path = require("path");

const SCRAPS_DIR = path.join(__dirname, "..", "public", "content", "scraps");
const OUT_FILE = path.join(__dirname, "..", "public", "data", "scraps-index.json");

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  const yaml = match[1];
  const body = match[2].trim();
  const frontmatter = {};
  const lines = yaml.split(/\r?\n/);
  let key = null;
  let arrayAcc = null;
  for (const line of lines) {
    const arrayItem = line.match(/^\s*-\s+(.+)$/);
    if (arrayItem) {
      if (arrayAcc) arrayAcc.push(arrayItem[1].replace(/^["']|["']$/g, ""));
      continue;
    }
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      key = kv[1];
      const raw = kv[2].trim();
      if (raw === "" && (key === "tags" || key === "category")) {
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
  return { frontmatter, body };
}

function buildIndex() {
  if (!fs.existsSync(SCRAPS_DIR)) {
    fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
    fs.writeFileSync(OUT_FILE, "[]", "utf8");
    console.log("content/scraps not found, wrote empty scraps-index.json");
    return;
  }

  const files = fs.readdirSync(SCRAPS_DIR).filter((f) => f.endsWith(".md"));
  const items = [];
  let id = 0;
  for (const file of files.sort()) {
    const slug = file.replace(/\.md$/i, "");
    const filePath = path.join(SCRAPS_DIR, file);
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = parseFrontmatter(content);
    id += 1;
    items.push({
      id: frontmatter.id || `scrap-${id}`,
      slug: frontmatter.slug || slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || "",
      category: frontmatter.category || null,
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      source: frontmatter.source || null,
      country: frontmatter.country || null,
      institute: frontmatter.institute || null,
      correspondingAuthor: frontmatter.correspondingAuthor || null,
      abstract: frontmatter.abstract || null,
      type: frontmatter.type || null,
      language: frontmatter.language || null,
    });
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(items, null, 2), "utf8");
  console.log(`Built scraps-index.json: ${items.length} items from content/scraps/*.md`);
}

buildIndex();
