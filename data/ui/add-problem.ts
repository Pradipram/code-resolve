export type FormFieldName =
  | "problemName"
  | "problemLink"
  | "platform"
  | "level"
  | "status"
  | "note";

export type FormArrayListItem = {
  name: FormFieldName;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export const formArrayList: FormArrayListItem[] = [
  {
    name: "problemName",
    label: "Problem Name",
    placeholder: "Two Sum",
  },
  {
    name: "problemLink",
    label: "Problem Link",
    placeholder: "https://leetcode.com/problems/two-sum/",
  },
  {
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
    name: "level",
    label: "Difficulty Level",
    options: [
      { value: "easy", label: "Easy" },
      { value: "medium", label: "Medium" },
      { value: "hard", label: "Hard" },
    ],
  },
  {
    name: "status",
    label: "Status",
    options: [
      { value: "Solved", label: "Solved" },
      { value: "Attempted", label: "Attempted" },
      { value: "Unresolved", label: "Unresolved" },
    ],
  },
  {
    name: "note",
    label: "Note (optional)",
    placeholder: "Enter any additional notes or observations",
  },
];
