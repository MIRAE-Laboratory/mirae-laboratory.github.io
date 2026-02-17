import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
/*
=============== 
Variables
===============
*/
:root {
  --border: 1px solid var(--bs-primary);
  --transition: all 0.3s linear;
  --nav-height: 55px;
  --min-footer-height: 11vh;
  --card-height: 29rem;
  /* IT 컬러셋 */
  --it-text-primary: #212529;
  --it-text-secondary: #495057;
  --it-text-muted: #6c757d;
  --it-link-color: #007bff;
  --it-link-hover: #0056b3;
  --it-nav-bg: #000000;
  --it-nav-text: #ffffff;
  --it-bg-light: #f8f9fa;
}

/*
=============== 
Global Styles
===============
*/
main {
  min-height: calc(100vh - 2 * var(--nav-height) - 2rem);
  background-color: #ffffff;
  color: var(--it-text-primary);
}

section {
  margin: 1rem 0;
}

/* 텍스트 색상 개선 */
body {
  color: var(--it-text-primary);
  background-color: #ffffff;
}

.text-muted {
  color: var(--it-text-secondary) !important;
}

a {
  color: var(--it-link-color);
  text-decoration: none;
}

a:hover {
  color: var(--it-link-hover);
  cursor: pointer;
}

/* Card 텍스트 색상 개선 */
.card {
  color: var(--it-text-primary);
}

.card-title {
  color: var(--it-text-primary);
}

.card-text {
  color: var(--it-text-primary);
}

.card-subtitle {
  color: var(--it-text-secondary) !important;
}

/* Navbar 스타일 */
.navbar-dark {
  background-color: #000000 !important;
}

.navbar-dark .navbar-nav .nav-link {
  color: #ffffff !important;
}

.navbar-dark .navbar-nav .nav-link:hover,
.navbar-dark .navbar-nav .nav-link.active {
  color: #007bff !important;
}

.section {
  min-height: 100vh;
  display: grid;
  align-items: start;
  padding: var(--nav-height) 0;
}


.title {
  font-family: "Permanent Marker";
}

.link-icons {
  line-height: 0;
  font-size: 2.25rem;
  margin: 0 1rem;
  color: #212529;

  &:hover {
    color: #007bff;
  }
}

.page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

@media screen and (min-width: 800px) {
  .link-icons {
    font-size: 2.5rem;
  }
  .form-group {
      max-width: 750px;
    }
}

@media screen and (min-width: 1367px) {
  .link-icons:hover {
    color: var(--bs-primary);
  }
}

/* Markdown Contents Styles */
.markdown-content {
  line-height: 1.6;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
    color: var(--it-text-primary);
  }
  
  h1 {
    font-size: 2em;
    border-bottom: 2px solid var(--bs-primary);
    padding-bottom: 0.3em;
  }
  
  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  h3 {
    font-size: 1.25em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  
  li {
    margin-bottom: 0.5em;
  }
  
  code {
    background-color: #f6f8fa;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    color: #e83e8c;
  }

  .diagram-container,
  .mermaid {
    margin: 1em 0;
    text-align: center;
  }
  .diagram-container svg,
  .mermaid svg {
    max-width: 100%;
    height: auto;
  }
  
  pre {
    background-color: #f6f8fa;
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin-bottom: 1em;
    
    code {
      background-color: transparent;
      padding: 0;
      color: inherit;
    }
  }
  
  blockquote {
    border-left: 4px solid var(--bs-primary);
    padding-left: 1em;
    margin-left: 0;
    color: var(--it-text-secondary);
    font-style: italic;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
    
    th, td {
      border: 1px solid #dfe2e5;
      padding: 0.5em;
    }
    
    th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
  }
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    margin: 1em 0;
  }
  
  a {
    color: var(--it-link-color);
    text-decoration: underline;
    
    &:hover {
      color: var(--it-link-hover);
    }
  }
  
  hr {
    border: none;
    border-top: 1px solid #eaecef;
    margin: 2em 0;
  }
}
`;

export default GlobalStyles;
