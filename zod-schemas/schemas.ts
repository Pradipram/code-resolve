import { languageOptions } from "@/data/ui/add-code";
import z from "zod";

export const AddCodeFormSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),
  language: z.enum(languageOptions as [string, ...string[]]),
  note: z
    .string()
    .max(500, "Note must be at most 500 characters long")
    .optional(),
  code: z.string().min(1, "Code cannot be empty"),
});

export const AddProblemFormSchema = z.object({
  problemName: z.string().min(3, "Problem name must be at least 3 characters"),
  problemLink: z.string().url("Please enter a valid URL"),
  platform: z.enum(["codeforces", "leetcode", "geeksforgeeks", "codestudio"]),
  level: z.union([
    z.enum(["easy", "medium", "hard"]),
    z.string().regex(/^[0-9]+$/, "Enter a valid number"),
  ]),
  status: z.enum(["Solved", "Attempted", "Unsolved"]),
  note: z
    .string()
    .max(1000, "Note must be at most 1000 characters long")
    .optional(),
});
