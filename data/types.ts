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

export interface CodeInterface {
  code_id: string;
  problem_id: number;
  title: string;
  language: CodeLanguage;
  note?: string | null;
  code: string;
  created_at: string; // ISO string, or Date if you convert
  updated_at: string; // ISO string, or Date if you convert
}

export type CodeType = CodeInterface;

export interface ProblemInterface {
  problem_id: number;
  user_id: string;
  problem_name: string;
  problem_link: string;
  platform: string;
  level: string;
  status: string;
  codeCount: number;
  note?: string | null;
  created_at: string; // or Date
  updated_at: string; // or Date
}
