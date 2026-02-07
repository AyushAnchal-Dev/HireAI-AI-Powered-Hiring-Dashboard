export function calculateMatch(
  resumeSkills: string[],
  jobSkills: string[]
) {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedResume = resumeSkills.map(normalize);

  let matched = 0;

  jobSkills.forEach((skill) => {
    if (
      normalizedResume.some((rs) =>
        rs.includes(normalize(skill))
      )
    ) {
      matched++;
    }
  });

  const score = Math.round((matched / jobSkills.length) * 100);

  return score;
}
