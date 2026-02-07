export function calculateMatchScore(
  resumeSkills: string[],
  jobSkills: string[]
) {
  if (jobSkills.length === 0) {
    return { score: 0, matchedSkills: [] };
  }

  const resume = resumeSkills.map((s) => s.toLowerCase());
  const job = jobSkills.map((s) => s.toLowerCase());

  const matchedSkills = job.filter((skill) =>
    resume.includes(skill)
  );

  const score = Math.round(
    (matchedSkills.length / job.length) * 100
  );

  return {
    score,
    matchedSkills,
  };
}
