/**
 * public/content/professor.md → public/data/professor.json
 * public/content/people/*.md → public/data/members.json
 * (content 전체가 public/content 아래에 있음 → 옵시디언에서 md·이미지 경로 공통)
 */

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

const CONTENT_DIR = path.join(__dirname, "..", "public", "content");
const OUT_DIR = path.join(__dirname, "..", "public", "data");

function parseFrontmatterSimple(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  const yamlStr = match[1];
  const frontmatter = {};
  const lines = yamlStr.split(/\r?\n/);
  let arrayAcc = null;
  for (const line of lines) {
    const arrayItem = line.match(/^\s*-\s+(.*)$/);
    if (arrayItem) {
      if (arrayAcc) {
        const val = arrayItem[1].trim().replace(/^["']|["']$/g, "");
        arrayAcc.push(val === "null" || val === "" ? null : val);
      }
      continue;
    }
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      const key = kv[1];
      let raw = kv[2].trim();
      if (raw === "") {
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
      } else if (raw === "null") {
        frontmatter[key] = null;
        arrayAcc = null;
      } else {
        frontmatter[key] = raw;
        arrayAcc = null;
      }
      continue;
    }
  }
  return { frontmatter };
}

function buildProfessor() {
  const mdPath = path.join(CONTENT_DIR, "professor.md");
  const outPath = path.join(OUT_DIR, "professor.json");

  if (!fs.existsSync(mdPath)) {
    console.log("content/professor.md not found, skipping professor.json");
    return;
  }

  const mdContent = fs.readFileSync(mdPath, "utf8");
  const match = mdContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    console.warn("professor.md has no frontmatter");
    return;
  }

  let frontmatter;
  try {
    frontmatter = yaml.parse(match[1]);
  } catch (e) {
    console.warn("professor.md YAML parse error:", e.message);
    return;
  }

  if (!frontmatter || typeof frontmatter !== "object") {
    frontmatter = {};
  }

  const arr = (v) => (Array.isArray(v) ? v : []);
  const out = {
    name: frontmatter.name || "",
    nameEn: frontmatter.nameEn || "",
    imageUrl: frontmatter.imageUrl || null,
    title1: frontmatter.title1 || "",
    title2: frontmatter.title2 || "",
    title3: frontmatter.title3 || "",
    contactTel: frontmatter.contactTel || "",
    contactEmail: frontmatter.contactEmail || "",
    fullProfileUrl: frontmatter.fullProfileUrl || "",
    cvPdfUrl: frontmatter.cvPdfUrl || null,
    academicCvPdfUrl: frontmatter.academicCvPdfUrl || null,
    researchAreas: arr(frontmatter.researchAreas),
    education: arr(frontmatter.education),
    awards: arr(frontmatter.awards),
    careerTeaching: arr(frontmatter.careerTeaching),
    careerTransfer: arr(frontmatter.careerTransfer),
    careerRnd: arr(frontmatter.careerRnd),
    publicationsInternational: arr(frontmatter.publicationsInternational),
    publicationsDomestic: arr(frontmatter.publicationsDomestic),
    patents: arr(frontmatter.patents),
    software: arr(frontmatter.software),
    books: arr(frontmatter.books),
    contributions: arr(frontmatter.contributions),
    media: arr(frontmatter.media),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
  console.log("Built professor.json from content/professor.md");
}

function buildMembers() {
  const peopleDir = path.join(CONTENT_DIR, "people");
  const outPath = path.join(OUT_DIR, "members.json");

  if (!fs.existsSync(peopleDir)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(outPath, "[]", "utf8");
    console.log("content/people not found, wrote empty members.json");
    return;
  }

  const files = fs.readdirSync(peopleDir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  const members = [];
  for (const file of files) {
    const id = file.replace(/\.md$/i, "");
    const filePath = path.join(peopleDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const { frontmatter } = parseFrontmatterSimple(content);
    let researchAreas = frontmatter.researchAreas;
    if (Array.isArray(researchAreas)) {
      researchAreas = researchAreas.filter((a) => a != null && a !== "");
    } else if (typeof researchAreas === "string" && researchAreas.trim()) {
      researchAreas = researchAreas.split(",").map((s) => s.trim()).filter(Boolean);
    } else {
      researchAreas = [];
    }
    let avatar = frontmatter.avatar || null;
    if (avatar && typeof avatar === "string" && !avatar.startsWith("http") && !avatar.startsWith("/")) {
      avatar = `/content/people/${avatar}`;
    }
    members.push({
      id: frontmatter.id || id,
      name: frontmatter.name || id,
      role: frontmatter.role || "",
      avatar,
      bio: frontmatter.bio || "",
      email: frontmatter.email || null,
      link: frontmatter.link || null,
      researchAreas,
      order: frontmatter.order != null ? Number(frontmatter.order) : 999,
    });
  }
  members.sort((a, b) => a.order - b.order);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(members, null, 2), "utf8");
  console.log(`Built members.json: ${members.length} items from content/people/*.md`);
}

buildProfessor();
buildMembers();
