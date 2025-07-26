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
