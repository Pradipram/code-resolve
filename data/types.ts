export enum CodeLanguage {
  python = "python",
  cpp = "cpp",
  javascript = "javascript",
  java = "java",
  c = "c",
  typescript = "typescript",
  csharp = "csharp",
  go = "go",
  ruby = "ruby",
  rust = "rust",
  swift = "swift",
  kotlin = "kotlin",
  php = "php",
  shell = "shell",
  json = "json",
  markdown = "markdown",
  html = "html",
  css = "css",
  xml = "xml",
  sql = "sql",
  yaml = "yaml",
  perl = "perl",
  r = "r",
  scala = "scala",
  dart = "dart",
  objectivec = "objectivec",
  vb = "vb",
  lua = "lua",
  haskell = "haskell",
  julia = "julia",
}

export type CodeType = {
  code_id: string;
  problem_id: number;
  title: string;
  language: CodeLanguage;
  note?: string | null;
  code: string;
  created_at: string; // ISO string, or Date if you convert
  updated_at: string; // ISO string, or Date if you convert
};
