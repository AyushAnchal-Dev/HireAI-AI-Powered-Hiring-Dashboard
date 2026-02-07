import { jobRoles } from "@/data/jobRoles";
import { calculateMatch } from "./matchEngine";

export function generateJobMatches(resumeSkills: string[]) {
  return jobRoles.map((role) => ({
    title: role.title,
    match: calculateMatch(resumeSkills, role.skills),
  }))
  .filter((r) => r.match > 40)
  .sort((a, b) => b.match - a.match);
}
