HireAI – AI-Powered Hiring Dashboard

HireAI is a modern, full-stack SaaS hiring platform that automates recruitment, technical evaluation, and candidate shortlisting using AI-assisted intelligence.

It provides separate dashboards for Recruiters and Candidates, real-time coding assessments with AI code review, automated DSA problem generation, and analytics — all inside a beautiful, production-ready UI.

🚀 Core Features
👤 Authentication & Roles

Secure Login / Signup

Role-based access:

Recruiter

Candidate

Protected routes & dashboards

🧑‍💼 Recruiter Features

Job Posting & Management

Create, update, and manage job listings

Candidate Applications

View applicants per job

Prevent duplicate applications

Technical Assessments

Post quizzes and coding problems

Schedule live assessments

AI-Reviewed Submissions

View AI feedback on candidate code

Analyze problem-solving quality

Shortlisting & Filtering

Filter candidates by match score & performance

Analytics Dashboard

Hiring funnel metrics

Assessment activity insights

👨‍🎓 Candidate Features

Profile Management

Skills, live projects, certifications

Learning progress tracking

Job Applications

Apply to jobs

Track application status

Coding Assessments

Solve DSA problems inside browser

Monaco Editor integration

AI Feedback on Code

Logic validation

Edge-case analysis

Time & space complexity review

Optimization suggestions

Submission History

View past solutions

Track improvement over time

Quizzes & Challenges

Recruiter-posted quizzes

Automated evaluations

🤖 AI Capabilities (No Cloud Cost)
🔹 Automated DSA Problem Generation

Daily generation of 15+ unique DSA problems

Sources:

Competitive programming trends (Codeforces-style)

Mathematical fallback engine

Zero duplication using problem signatures

Always available (AI + fallback hybrid system)

🔹 AI Code Review (Ollama Integration)

HireAI uses Ollama (Llama 3) running locally to provide real AI feedback on code submissions.

AI analyzes:

Algorithm correctness

Edge cases

Time complexity

Space complexity

Code readability

Optimization opportunities

Feedback is:

Generated per submission

Stored in database

Accessible via solution history API

This turns HireAI into an AI code reviewer, not just a test platform.

🧠 Evaluation Engine

Automated test cases

Edge-case validation

Time limit checks

Result classification:

Accepted / Failed

AI feedback stored alongside solution

🎨 UI / UX Highlights

Modern SaaS UI

Next.js App Router

Tailwind CSS

shadcn/ui components

Framer Motion animations

Spline 3D hero section

Glassmorphism cards

Dark mode support

Fully responsive

🛠️ Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

Tailwind CSS

shadcn/ui

Framer Motion

React Hook Form + Zod

Monaco Editor

Backend

Next.js API Routes

Prisma ORM

PostgreSQL (Supabase / Neon)

NextAuth.js

AI & Automation

Ollama (Llama 3)

Hybrid AI + algorithmic fallback engine

Automated cron-based question generation

Infrastructure

Frontend + Backend: Vercel

Database: Supabase / Neon

Resume Uploads: Cloudinary

⚙️ System Workflow

User signs up as Recruiter or Candidate

Recruiter posts jobs

Candidate applies

System prevents duplicate applications

Candidate solves coding assessments

Code evaluated via:

Test cases

AI review

Feedback stored and retrievable

Recruiter reviews AI insights & shortlists

📦 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/AyushAnchal-Dev/HireAI-AI-Powered-Hiring-Dashboard
cd HireAI-AI-Powered-Hiring-Dashboard


2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file:

DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

4️⃣ Database Setup
npx prisma migrate dev

5️⃣ Start Ollama
ollama serve
ollama run llama3

6️⃣ Run Development Server
npm run dev


Open 👉 http://localhost:3000

🧪 API Highlights

POST /api/solutions – Submit & evaluate code

GET /api/solutions – Fetch solution history

POST /api/problems/generate – Automated DSA generation

POST /api/quiz – Create quizzes

POST /api/jobs – Job CRUD


📬 Contact

Author: Ayush Anchal

GitHub: https://github.com/AyushAnchal-Dev

LinkedIn: https://www.linkedin.com/in/ayush-anchal-04117028a

Email: abhardwaj8507@gmail.com

