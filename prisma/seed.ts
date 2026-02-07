import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Recruiter
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@hireai.com" },
    update: {},
    create: {
      email: "recruiter@hireai.com",
      role: "recruiter",
    },
  });

  console.log("Recruiter verified:", recruiter.email);

  // Candidate user + candidate profile
  const candidateUser = await prisma.user.upsert({
    where: { email: "candidate@hireai.com" },
    update: {},
    create: {
      email: "candidate@hireai.com",
      role: "candidate",
      candidates: {
        create: {
          name: "John Doe",
          resumeUrl: "https://example.com/resume.pdf",
          skills: ["react", "node", "typescript"],
        },
      },
    },
  });

  console.log("Candidate verified:", candidateUser.email);

  // Create a Job
  await prisma.job.create({
    data: {
      title: "Frontend Developer",
      department: "Engineering",
      description: "We are looking for a React expert.",
      skills: ["React", "TypeScript", "Tailwind"],
      recruiterId: recruiter.id,
    },
  });

  // Create a Problem
  const problem = await prisma.problem.create({
    data: {
      title: "Reverse a String",
      description: "Write a function that reverses a string. Input: 'hello', Output: 'olleh'.",
      difficulty: "Easy",
      tags: ["Algorithms", "Strings"],
      recruiterId: recruiter.id,
      testCases: {
        create: [
          { input: "hello", output: "olleh" },
          { input: "world", output: "dlrow" }
        ]
      }
    },
  });

  // Create a Question Pack
  await prisma.questionPack.create({
    data: {
      title: "Daily Challenge - Feb 5",
      type: "Daily",
      problems: {
        connect: { id: problem.id }
      }
    }
  });

  // Create a Quiz
  await prisma.quiz.create({
    data: {
      title: "React Fundamentals",
      timeLimit: 15,
      questions: [
        {
          question: "What is a hook?",
          options: ["A fishing tool", "A special function", "A class component"],
          answer: 1,
        },
      ],
      recruiterId: recruiter.id,
    },
  });

  // Create Templates
  await prisma.questionTemplate.createMany({
    data: [
      {
        pattern: "Sliding Window",
        category: "Array",
        difficulty: "Medium",
        basePrompt: "Generate a problem that requires finding a subarray meeting specific criteria (sum, length) using the sliding window technique.",
      },
      {
        pattern: "Two Pointers",
        category: "Two Pointers",
        difficulty: "Easy",
        basePrompt: "Generate a problem involving searching pairs in a sorted array or checking palindromes using two pointers.",
      },
      {
        pattern: "Array Sum",
        category: "Array",
        logicId: "array_sum",
        difficulty: "Easy",
        basePrompt: null
      },
      {
        pattern: "Two Sum Target",
        category: "Two Pointers",
        logicId: "two_sum",
        difficulty: "Easy",
        basePrompt: null
      },
      {
        pattern: "Max Consecutive Ones",
        category: "Array",
        logicId: "max_consecutive",
        difficulty: "Easy",
        basePrompt: null
      }
    ]
  });

  console.log("Seed data (Job, Problem, Quiz, Templates) created.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
