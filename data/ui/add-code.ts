export const languageOptions: string[] = [
  "python",
  "cpp",
  "javascript",
  "java",
  "c",
  "typescript",
  "csharp",
  "go",
  "ruby",
  "rust",
  "swift",
  "kotlin",
  "php",
  "shell",
  "json",
  "markdown",
  "html",
  "css",
  "xml",
  "sql",
  "yaml",
  "perl",
  "r",
  "scala",
  "dart",
  "objective-c",
  "vb",
  "lua",
  "haskell",
  "julia",
] as const;

export type AddCodeFieldName = "title" | "language" | "code" | "note";

interface AddCodeField {
  type: string;
  name: AddCodeFieldName;
  label: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
}

export const AddCodeFormFields: AddCodeField[] = [
  {
    type: "input",
    label: "Title",
    name: "title",
    placeholder: "Enter a title for your code",
  },
  {
    type: "select",
    label: "Language",
    name: "language",
    options: languageOptions,
  },
  {
    type: "textarea",
    label: "Note",
    name: "note",
    placeholder: "Enter any additional notes(optional)",
    min: 800,
    max: 4000,
  },
  {
    type: "code",
    label: "Code",
    name: "code",
    placeholder: "Write your code here",
  },
];

export const extToLang: Record<string, string> = {
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  c: "c",
  py: "python",
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  java: "java",
  cs: "csharp",
  go: "go",
  rb: "ruby",
  rs: "rust",
  swift: "swift",
  kt: "kotlin",
  php: "php",
  sh: "shell",
  json: "json",
  md: "markdown",
  html: "html",
  css: "css",
  xml: "xml",
  sql: "sql",
  yaml: "yaml",
  yml: "yaml",
  pl: "perl",
  r: "r",
  scala: "scala",
  dart: "dart",
  m: "objective-c",
  vb: "vb",
  lua: "lua",
  hs: "haskell",
  jl: "julia",
};
