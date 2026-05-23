# 🚨 AI Observability RCA

> Real-time website monitoring + AI-powered incident intelligence

AI Observability RCA helps engineering teams monitor websites, detect incidents in real time, analyze probable root causes using Gemini AI, and generate actionable remediation reports — all from one dashboard.

Built for fast incident response, reliability monitoring, and intelligent debugging.

---

## ✨ What it does

Enter a website URL.

The platform automatically:

✅ Monitors uptime and availability  
✅ Tracks response latency and endpoint health  
✅ Collects logs and telemetry  
✅ Detects incidents and anomalies  
✅ Correlates failures across services  
✅ Uses Gemini AI to identify probable root causes  
✅ Suggests remediation steps  
✅ Generates downloadable incident reports

---

## 🔄 Platform Flow

```text
Website URL
    ↓
Monitoring Engine
    ↓
Telemetry Collection
    ↓
Incident Correlation
    ↓
Gemini RCA Engine
    ↓
AI Dashboard + Copilot + Reports
```

---

## 📊 Core Features

### 🌐 Website Monitoring
- Uptime checks
- HTTP status monitoring
- SSL certificate validation
- Response latency tracking
- Endpoint health checks

---

### 📡 Live Telemetry Dashboard
- Real-time monitoring feed
- Dynamic charts
- Live status cards
- Activity timeline
- WebSocket updates

---

### 🚨 Incident Detection
Automatically identifies:
- Latency spikes
- Downtime
- Failed API responses
- Deployment regressions
- Authentication failures
- Cascading service failures

Includes:
- Severity classification
- Impacted services
- Correlated incidents

---

### 🤖 Gemini AI Root Cause Analysis

Powered by:

`models/gemini-flash-latest`

AI generates:

- Root cause analysis
- Plain-English explanations
- Severity
- Confidence score
- Impacted services
- Recommended fixes

Example:

> “Authentication endpoint timeout caused cascading failures across payment services after deployment.”

---

### 💬 AI Copilot

Ask operational questions like:

- Why is the website slow?
- Which service failed?
- What changed before the outage?
- What should we fix first?

---

### 📄 Downloadable Reports

Generate:

- PDF incident report
- JSON export
- CSV telemetry export

Includes:
- Incident summary
- Metrics
- Logs
- Timeline
- AI RCA
- Suggested remediation

---

## 🔌 APIs Used

### Grafana API
Used for:
- Metrics
- Telemetry ingestion
- Monitoring data

### New Relic API
Used for:
- Logs
- Incidents
- Telemetry events

### Gemini API
Used for:
- Root cause analysis
- AI reasoning
- Remediation generation

---

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Recharts
- WebSockets

### Backend
- FastAPI
- Python
- Async architecture

### AI + Monitoring
- Gemini API
- Grafana API
- New Relic API

---

## 📁 Project Structure

```bash
ai-observability-rca/
│
├── frontend/
├── backend/
├── README.md
├── requirements.txt
└── .env
```

---

## ⚙️ Environment Variables

Create `.env`

```env
GRAFANA_URL=
GRAFANA_API_KEY=

NEWRELIC_API_KEY=

GEMINI_API_KEY=
```

---

## 📦 Backend Requirements

Example `requirements.txt`

```txt
fastapi
uvicorn
requests
python-dotenv
websockets
pydantic
google-generativeai
```

---

## 🚀 Run Locally

### Clone

```bash
git clone https://github.com/<your-username>/ai-observability-rca.git
cd ai-observability-rca
```

---

### Backend

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```bash
http://localhost:8000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

## 🧪 Quick Test Inputs

Healthy:

```txt
https://google.com
```

Example:

```txt
https://example.com
```

Copilot:

```txt
Why is the website slow?
Which service failed?
What changed before the outage?
```

---

## 🎯 Use Cases

- Website reliability monitoring
- Incident triage
- DevOps observability
- SRE workflows
- AI-assisted debugging
- Hackathon demos

---

## 📌 Built for

Fast incident detection + AI-powered reliability analysis.

---

## License

MIT
