# Deployment Guide

This project uses **Next.js** (Frontend/API) and **Ollama** (AI). Because of the local AI and code execution features, standard "static" hosting like Vercel needs specific configuration to work.

## 🚀 Option 1: Docker (Recommended for Full Features)
Use this option if you want the **AI Code Review**, **DSA Generator**, and **Code Runner** to work exactly as they do on your local machine.

### Requirements
- A platform that supports Docker:
  - [Railroad](https://railway.app/)
  - [Render](https://render.com/)
  - [Fly.io](https://fly.io/)
  - Any VPS (AWS EC2, DigitalOcean, Hetzner)

### Steps
1.  **Database**: Create a hosted PostgreSQL database (e.g., via Supabase or Neon). Update your `.env` with the new `DATABASE_URL`.
2.  **Ollama**:
    - **Easiest**: Use a VPS and run `ollama serve` alongside your Docker container.
    - **Cloud**: Deploy a separate generic GPU instance for Ollama context, OR use an external API (OpenAI/Groq) and update the code to use that instead.
3.  **Deploy App**:
    - Push this repo to GitHub.
    - Connect your GitHub repo to Railway/Render.
    - Set the Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, etc.).
    - The platform will automatically detect the `Dockerfile` and build it.

## ☁️ Option 2: Vercel (Standard)
Use this if you *only* care about the UI, Job Posting, and standard features, and are okay with **AI/Code Runner being disabled** or requiring major changes.

### Limitations
- **No Local Ollama**: Vercel cannot run `ollama serve` in the background. The "Generate Problem" and "AI Feedback" features will fail unless you change the code to point to an external API URL (e.g., ngrok tunneling to your laptop, or a paid API).
- **No Code Runner**: Vercel does not allow executing code (`child_process`) for security reasons. The "Run Code" button will fail.

### Steps
1.  Push to GitHub.
2.  Import project in Vercel.
3.  Add Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`).
4.  Deploy.

## 🛠️ Configuring for Production
If running via Docker/VPS, make sure your `.env` is updated:

```env
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[db]"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
OLLAMA_BASE_URL="http://host.docker.internal:11434" # If Ollama is on the host
```
