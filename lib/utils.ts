import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DSAProblemListData from "@/data/DSAProblemList.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getProblemNameFromProblemIdFromDSAList = (
  problem_id: number
): string | null => {
  const problem = (DSAProblemListData.DSAProblemList || []).find(
    (p) => p.id === problem_id
  );
  return problem ? problem.title : null;
};
