import { calculateMatchScore } from "@/lib/matchSkills";

const jobSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "REST APIs",
];

const resumeSkills = [
  "React",
  "Next.js",
  "JavaScript",
  "Tailwind CSS",
  "HTML",
];

const match = calculateMatchScore(resumeSkills, jobSkills);

export const candidates = [
  {
    id: 1,
    name: "Rahul Sharma",
    job: "Frontend Developer",
    match: match.score,
    status: "Pending",
  },
];

