# Local AI Setup Guide (Ollama)

To enable the "Infinite AI Generator," you need to run a local LLM. We use **Ollama** because it is free, fast, and private.

## 1. Install Ollama
Download and install from: [https://ollama.com/download](https://ollama.com/download)

## 2. Pull a Model
Open your terminal (PowerShell or CAmd) and run **one** of these commands (depending on your RAM):

### Recommended (Fast & Smart)
```bash
ollama pull llama3
```
*Requires ~4GB RAM.*

### Alternative (Lightweight)
```bash
ollama pull mistral
```

## 3. Run the Model
Start the server (keep this terminal open or run in background):
```bash
ollama serve
```

## 4. Verification
Check if it's running by visiting: [http://localhost:11434](http://localhost:11434).
You should see: `Ollama is running`.

## 5. Configuration (Optional)
The app assumes the default port `11434`. If you change it, update `src/lib/ai/ollama.ts`.

## 6. Troubleshooting
### Error: `dial tcp ... i/o timeout`
This is a network blockage (ISP/Firewall).
1.  **VPN**: Try turning on a VPN (or turning it off if active).
2.  **DNS**: Change your DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1).
3.  **Proxy**: If you use a corporate proxy, set `HTTP_PROXY` env var.
4.  **Heavy Traffic**: The Ollama registry might be busy. Retry `ollama pull llama3` in a few minutes.

### ⚠️ Fallback
**Don't worry!** If you cannot get Ollama running, the system will **automatically fallback** to the combinatorial engine (Phase 5). You can still proceed with testing the website!
