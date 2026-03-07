# PaperIQ 🧠

> **One upload. Five Gemini features. Understand any research paper in seconds.**

PaperIQ is a full-stack AI research paper decoder built with Next.js 14 and Gemini 2.5 Flash. Upload a PDF once and instantly get plain-English summaries, visual explanations, a conversational Q&A interface, and persistent paper memory — all powered by Gemini's native multimodal capabilities.

---

## Features

### 🎓 ELIF — Explain Like I'm a Freshman
Summarizes any research paper at four audience levels: **High School**, **Undergrad**, **Recruiter**, and **Expert**. Each level produces a different analogy, vocabulary, and set of mental models — not just a different text length. Output includes a one-liner analogy, 3–4 paragraph summary, key contributions list, an expandable 5-term jargon glossary, why it matters, and limitations.

### 🔬 ScholarSight — Visual Decoder
Upload a screenshot of any chart, diagram, table, or equation from a paper. Gemini explains it in plain English — what it shows, what the axes mean, what conclusion to draw, and what most readers miss. If a paper PDF is also loaded, Gemini receives both the image and the full PDF simultaneously and explains how the visual connects to the paper's thesis.

### 💬 Chat — Ask the Paper Anything
A full multi-turn chat interface for asking natural language questions about the uploaded paper. Suggested question chips help guide the conversation. Full conversation history is sent on every API call so Gemini never loses context. Chat history is saved to MongoDB so users can return days later and continue the same conversation.

### 🗄️ Paper Memory
Every analyzed paper is fingerprinted with an MD5 hash and stored in MongoDB along with all cached analyses and chat history. If the same PDF is uploaded again, PaperIQ recognizes it instantly and asks: *"Load your saved version or start fresh?"* — restoring all previous results with zero redundant Gemini calls.

### 🔐 Authentication
Full user account system with a welcome page, registration, and login. Auth state lives in React Context — no third-party auth library. Protected routes redirect unauthenticated users to `/login`. Each user only sees their own paper history.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), Tailwind CSS, lucide-react |
| AI | Gemini 2.5 Flash via `@google/generative-ai` SDK |
| Database | MongoDB Atlas |
| Hashing | crypto-js (MD5 PDF fingerprinting) |

---

## Pages

```
/welcome        → Landing page — hero section, feature overview, CTAs
/register       → Create account
/login          → Sign in
/               → Home — PDF upload (protected)
/elif           → ELIF summarizer (protected)
/scholarsight   → Visual analyzer (protected)
/chat           → Chat interface (protected)
```

---

## Setup

### 1. Clone and install

```bash
git clone https://github.com/yourusername/paperiq.git
cd paperiq
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the root:

```env
# Gemini API Keys (5 keys for round-robin rotation)
GEMINI_API_KEY_1=your_key_here
GEMINI_API_KEY_2=your_key_here
GEMINI_API_KEY_3=your_key_here
GEMINI_API_KEY_4=your_key_here
GEMINI_API_KEY_5=your_key_here

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/paperiq

# Auth secret (any random string)
AUTH_SECRET=your_random_secret_here
```

Get Gemini API keys free at: https://aistudio.google.com/app/apikey  
Get MongoDB connection string at: https://cloud.mongodb.com

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Gemini Free Tier Engineering

PaperIQ runs entirely on Gemini's free tier. Here is how we engineered around the quota limits:

### Free tier limits for Gemini 2.5 Flash

| Limit | Value | What it means |
|-------|-------|---------------|
| **RPM** — Requests Per Minute | 1 / key | How many times you can click "Analyze" per 60 seconds |
| **TPM** — Tokens Per Minute | 250,000 / key | A 10-page PDF ≈ 15K–20K tokens |
| **RPD** — Requests Per Day | 20 / key | The hardest constraint — absolute daily cap |

### 5-Key Round-Robin Rotation

To work around these limits, PaperIQ uses 5 separate API keys across different Google Cloud projects:

- Every request automatically cycles to the next key in the rotation
- Usage count is tracked per key in memory
- If any key hits its RPD limit of 20 it is automatically skipped
- **Result: 5 × 1 RPM = 5 requests per minute total**
- **Result: 5 × 20 RPD = 100 requests per day total**
- Zero additional cost — each key belongs to a separate Google Cloud project with its own free quota allocation

```javascript
// Key rotation logic (simplified)
const keys = [KEY_1, KEY_2, KEY_3, KEY_4, KEY_5]
let currentIndex = 0

const getNextKey = () => {
  const key = keys[currentIndex]
  currentIndex = (currentIndex + 1) % keys.length
  return key
}
```

---

## Why Gemini 2.5 Flash

### Native PDF bytes
Raw base64 bytes are sent directly to Gemini as `inlineData`. No `pdf-parse`, no text extraction library, no preprocessing pipeline. The PDF goes straight in.

```javascript
const result = await model.generateContent([
  { inlineData: { data: pdfBase64, mimeType: 'application/pdf' } },
  prompt
])
```

### 1 Million token context window
The entire research paper — all figures, equations, appendices, and references — fits in a single prompt. No RAG architecture, no vector database, no chunking logic needed.

### True multimodal in one call
ScholarSight sends the diagram image AND the full paper PDF to Gemini simultaneously. Gemini reasons across both in a single API call — not possible with text-only models.

```javascript
const result = await model.generateContent([
  { inlineData: { data: pdfBase64,    mimeType: 'application/pdf' } },
  { inlineData: { data: imageBase64,  mimeType: imageMimeType     } },
  prompt
])
```

### Structured JSON output
Every API route prompts Gemini to return strict JSON which drives the dynamic UI — expandable jargon cards, severity badges, visual type chips, and insight panels.

### Audience-calibrated reasoning
The ELIF prompt describes a specific person (a 16-year-old, a recruiter, a PhD researcher) and Gemini adjusts its vocabulary, analogies, and mental models accordingly.

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/elif` | POST | Summarize paper at chosen audience level |
| `/api/scholarsight` | POST | Analyze a visual (image + optional PDF) |
| `/api/chat` | POST | Multi-turn chat with paper context |
| `/api/papers` | GET | Check if PDF hash exists in MongoDB |
| `/api/papers` | POST | Save paper and analysis to MongoDB |
| `/api/papers/chat` | POST | Append message to paper's chat history |
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/login` | POST | Authenticate user |

---

## MongoDB Schema

### users collection
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "createdAt": "Date"
}
```

### papers collection
```json
{
  "_id": "ObjectId",
  "hash": "string (MD5 of pdfBase64)",
  "userId": "ObjectId",
  "fileName": "string",
  "title": "string",
  "pdfBase64": "string",
  "elifCache": {
    "highschool": {},
    "undergrad": {},
    "recruiter": {},
    "expert": {}
  },
  "chatHistory": [
    { "role": "user | model", "text": "string", "savedAt": "Date" }
  ],
  "uploadedAt": "Date",
  "lastAccessedAt": "Date"
}
```

---

## Known Issues & Fixes

**Gemini model deprecations**  
`gemini-pro` and `gemini-2.0-flash` were either deprecated or had exhausted free tier quotas mid-build. Settled on `gemini-2.5-flash` as the only reliably free and capable model.

**429 Quota errors**  
Solved with the 5-key round-robin rotation system described above.

**Next.js env variable caching**  
After updating `.env.local`, delete the `.next` folder and restart:
```bash
rm -rf .next && npm run dev
```

**JSON.parse failing on Gemini responses**  
Gemini sometimes wraps JSON in markdown fences. Strip them before parsing:
```javascript
const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
const data = JSON.parse(clean)
```

---

## Project Structure

```
paperiq/
├── app/
│   ├── layout.js              ← PaperIQProvider context (PDF + auth state)
│   ├── page.js                ← Home / PDF upload
│   ├── welcome/page.js        ← Landing page
│   ├── login/page.js          ← Login
│   ├── register/page.js       ← Registration
│   ├── elif/page.js           ← ELIF summarizer
│   ├── scholarsight/page.js   ← Visual analyzer
│   ├── chat/page.js           ← Chat
│   └── api/
│       ├── elif/route.js
│       ├── scholarsight/route.js
│       ├── chat/route.js
│       ├── papers/route.js
│       ├── papers/chat/route.js
│       └── auth/
│           ├── login/route.js
│           └── register/route.js
├── lib/
│   └── mongodb.js             ← MongoDB connection singleton
├── .env.local                 ← API keys (never commit this)
├── package.json
└── README.md
```

---

## License

MIT
