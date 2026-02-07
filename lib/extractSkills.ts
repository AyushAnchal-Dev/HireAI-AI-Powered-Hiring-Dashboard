import { SKILLS } from "@/data/skills";

export function extractSkillsFromText(text: string): string[] {
  const lowerText = text.toLowerCase();

  const foundSkills = SKILLS.filter((skill) =>
    lowerText.includes(skill)
  );

  return [...new Set(foundSkills)];
}
