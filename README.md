# TailorAI

TailorAI is an AI agent that tailors a resume to a specific job description. Upload a resume (PDF) and paste a job description, and the agent runs a 5-stage prompt chain that produces a skill-gap report, an ATS keyword analysis, rewritten resume bullets (original vs. improved, side by side), and a tailored cover letter — while making autonomous decisions along the way about how aggressively to rewrite and whether the role is even a good fit.

## Features

- **Resume parsing** — extracts skills, experience, education, and projects from a PDF resume
- **Job description analysis** — extracts required/preferred skills, responsibilities, and ATS keywords
- **Skill gap detection** — computes a match percentage and highlights missing skills/keywords
- **Bullet rewriting** — rewrites resume bullets for the target role, with a reason given for each change
- **Cover letter generation** — produces a tailored cover letter based on the candidate's actual fit
- **Live progress tracking** — the frontend polls the backend and shows a 5-step progress bar as the chain runs
- **Token budget visibility** — the UI shows how many LLM context tokens remain during and after the analysis

### Agentic decision points

The chain isn't a fixed pipeline — it adapts based on what it finds:

1. **Self-healing parse** — if resume parsing comes back with no skills or fewer than 3 bullets, it automatically retries with a more aggressive extraction prompt.
2. **Adaptive rewrite strategy** — after gap detection, the agent picks how aggressively to rewrite bullets based on match percentage:
   - `> 85%` → light keyword tweaks only
   - `40–85%` → rewrite the weakest bullets
   - `< 40%` → full rewrite, flagged as a stretch role
   - Entirely different domain → skip the rewrite and suggest the candidate reconsider the role
3. **Self-evaluation** — after generating all outputs, the agent checks its own work for hallucinations (fabricated skills, invented metrics, wrong company/title) and re-runs the affected step if it finds any.

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Backend    | FastAPI (Python 3.11+), async/await throughout |
| Database   | MongoDB Atlas via Motor (async driver)         |
| AI         | Groq API (`llama-3.3-70b-versatile`)           |
| PDF Parsing| PyMuPDF (`fitz`)                               |
| Frontend   | React (Vite)                                   |
| HTTP Client| Axios                                          |

## Project Structure

```
TailorAI/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app entry, CORS, lifespan
│   │   ├── config.py                # Env var settings
│   │   ├── database.py              # MongoDB Atlas connection (Motor)
│   │   ├── models/                  # Pydantic models & API schemas
│   │   ├── routes/                  # /api/upload, /api/session/{id}, /api/health
│   │   ├── services/                # PDF parsing, Groq client, chain orchestration
│   │   └── prompts/                 # The 5-step prompt chain + self-evaluation
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/                   # HomePage (upload), ResultsPage (results + polling)
│   │   ├── components/              # Upload form, progress bar, gap report, bullets, cover letter
│   │   └── services/api.js          # Axios client
│   └── .env.example
├── CLAUDE.md                        # Coding conventions for this repo
└── TAILORAI_PROJECT_PLAN.md         # Detailed architecture & design notes
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (a free M0 tier works)
- A [Groq API key](https://console.groq.com)

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `backend/.env`:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tailorai
GROQ_API_KEY=your_groq_api_key_here
FRONTEND_URL=http://localhost:5173
```

> In MongoDB Atlas, add your current IP (or `0.0.0.0/0` for local dev) under **Network Access**, or connections will fail during the TLS handshake.

Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` should point at the backend:

```
VITE_API_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

The app is now available at **http://localhost:5173**.

## Usage

1. Open the app and upload a PDF resume.
2. Paste a job description.
3. Click **Analyze**. You'll be redirected to a results page that polls the backend and shows live progress through all 5 steps, plus a live token-budget counter that updates as the chain consumes context.
4. Once complete, review the skill gap report, rewritten bullets, and cover letter — each with a copy-to-clipboard button.

## API Endpoints

| Method | Path                        | Description                                              |
|--------|------------------------------|------------------------------------------------------------|
| POST   | `/api/upload`                | Upload a resume PDF + job description, starts the AI chain as a background task, returns a `session_id` |
| GET    | `/api/session/{session_id}`  | Poll for session status and results                       |
| GET    | `/api/health`                | Health check                                               |

### Example

```bash
curl -X POST http://localhost:8000/api/upload \
  -F "resume=@resume.pdf" \
  -F "job_description=We are hiring a backend engineer with Python and FastAPI experience..."

curl http://localhost:8000/api/session/<session_id>
```

## Testing

The backend includes manual test scripts for each stage of the chain (PDF parsing and each prompt step). Run them directly with the venv active:

```bash
cd backend
python test_pdf_parser.py
python test_step1_resume_parse.py
python test_step2_jd_analysis.py
python test_step3_gap_detection.py
python test_step4_bullet_rewrite.py
python test_step5_cover_letter.py
```

## Further Reading

- [`CLAUDE.md`](CLAUDE.md) — coding conventions and agentic decision-point rules for this repo
- [`TAILORAI_PROJECT_PLAN.md`](TAILORAI_PROJECT_PLAN.md) — full architecture, MongoDB schema, and prompt chain design
