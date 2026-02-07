export function calculateWeightedMatch(
  resumeSkills: string[],
  jobSkills: {
    core: string[];
    important: string[];
    bonus: string[];
  }
) {
  let score = 0;
  let maxScore = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  const weights = {
    core: 3,
    important: 2,
    bonus: 1,
  };

  // Pre-process resume skills to lowercase and remove punctuation
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedResumeSkills = resumeSkills.map(normalize);

  Object.entries(jobSkills).forEach(([level, skills]) => {
    skills.forEach((skill) => {
      const weight = weights[level as keyof typeof weights];
      const normalizedSkill = normalize(skill);
      maxScore += weight;

      if (normalizedResumeSkills.includes(normalizedSkill)) {
        score += weight;
        strengths.push(`${skill} (${level})`);
      } else {
        // Only consider missing core and important skills as weaknesses/todo
        if (level === "core" || level === "important") {
          weaknesses.push(`Missing ${level} skill: ${skill}`);
        }
      }
    });
  });

  const matchPercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return {
    matchPercent,
    confidence:
      matchPercent > 80
        ? "High"
        : matchPercent > 60
          ? "Medium"
          : "Low",
    strengths,
    weaknesses,
  };
}
