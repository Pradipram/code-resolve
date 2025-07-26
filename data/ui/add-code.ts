export const languageOptions: string[] = [
  "python",
  "cpp",
  "javascript",
  "java",
  "c",
  "typescript",
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
