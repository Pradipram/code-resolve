export type FormFieldName =
  | "problemName"
  | "problemLink"
  | "platform"
  | "level"
  | "status"
  | "note";

export interface FormArrayListItem {
  type: string;
  name: FormFieldName;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export const formArrayList: FormArrayListItem[] = [
  {
    type: "input",
    name: "problemName",
    label: "Problem Name",
    placeholder: "Two Sum",
  },
  {
    type: "input",
    name: "problemLink",
    label: "Problem Link",
    placeholder: "https://leetcode.com/problems/two-sum/",
  },
  {
    type: "select",
    name: "platform",
    label: "Platform",
    options: [
      { value: "leetcode", label: "LeetCode" },
      { value: "codeforces", label: "Codeforces" },
      { value: "geeksforgeeks", label: "GeeksforGeeks" },
      { value: "codestudio", label: "CodeStudio" },
    ],
  },
  {
    type: "select",
    name: "level",
    label: "Difficulty Level",
    options: [
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" },
    ],
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    options: [
      { value: "Solved", label: "Solved" },
      { value: "Attempted", label: "Attempted" },
      { value: "Unsolved", label: "Unsolved" },
    ],
  },
  {
    type: "textarea",
    name: "note",
    label: "Note (optional)",
    placeholder: "Enter any additional notes or observations",
  },
];
