// Skills icons - https://icon-sets.iconify.design/
import { Icon } from "@iconify/react";

/* START HERE
 **************************************************************
  Add your GitHub username (string - "YourUsername") below.
*/
export const githubUsername = "mirae-laboratory";

// Site name for document title (e.g. "People | Lab")
export const siteName = "Lab";

// Navbar Logo (public/contents/files/)
export const navLogo = `${process.env.PUBLIC_URL || ""}/contents/files/MIRAE_Logo.png`;

/* Skills
 ************************************************************** 
  Add or remove skills in the SAME format below, choose icons here - https://icon-sets.iconify.design/
*/
export const skillData = [
  {
    id: 1,
    skill: <Icon icon="mdi:language-html5" className="display-4" />,
    name: "HTML5",
  },
  {
    id: 2,
    skill: <Icon icon="ion:logo-css3" className="display-4" />,
    name: "CSS3",
  },
  {
    id: 3,
    skill: <Icon icon="fa6-brands:js" className="display-4" />,
    name: "JavaScript",
  },
  {
    id: 4,
    skill: <Icon icon="ri:bootstrap-fill" className="display-4" />,
    name: "BootStrap",
  },
  {
    id: 5,
    skill: <Icon icon="mdi:react" className="display-4" />,
    name: "React",
  },
  {
    id: 6,
    skill: <Icon icon="file-icons:styledcomponents" className="display-4" />,
    name: "Styled Components",
  },
  {
    id: 7,
    skill: <Icon icon="akar-icons:redux-fill" className="display-4" />,
    name: "Redux",
  },
  {
    id: 8,
    skill: <Icon icon="bi:git" className="display-4" />,
    name: "Git",
  },
  {
    id: 9,
    skill: <Icon icon="fa6-brands:square-github" className="display-4" />,
    name: "GitHub",
  },
];

/* Repositories
 ************************************************************** 
  List the repo names (string - "your-repo-name") you want to include (they will be sorted alphabetically).
  If empty, only the first 3 will be included.
*/
export const filteredRepositories = [];

// Custom images for repository cards (optional)
// Format: { name: "repo-name", image: importedImage }
export const repositoryCardImages = [];

/* Contact Info
 ************************************************************** 
  Add your formspree endpoint below.
  https://formspree.io/
*/
export const formspreeUrl = "https://formspree.io/f/mldrepaa";

// Footer icons theme (light or dark)
export const footerTheme = "dark";

/* Archive (archive) – menu categories
 **************************************************************
  Each item appears as a menu entry under Archive. Archive frontmatter
  should use category: "Paper" etc. to match these keys.
*/
export const archiveCategories = [
  { id: "all", label: "All", slug: "" },
  { id: "Paper", label: "Paper", slug: "Paper" },
  { id: "Technical Tips", label: "Technical Tips", slug: "Technical-Tips" },
  { id: "News", label: "News", slug: "News" },
  { id: "Tutorials", label: "Tutorials", slug: "Tutorials" },
];
