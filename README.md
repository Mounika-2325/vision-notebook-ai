# 🔮 Vision Notebook AI

An AI-powered research and knowledge assistant inspired by Google NotebookLM — with built-in **Computer Vision** capabilities powered by **Google Gemini AI**.

![Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb) ![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Document Processing** | Upload PDF, DOCX, TXT — AI extracts text & summaries |
| 🖼️ **Vision Analysis** | Gemini Vision detects objects, reads text (OCR), describes scenes |
| 💬 **AI Chat** | Conversational Q&A grounded in your documents |
| 📝 **Notes Generator** | 6 note types: summary, detailed, bullets, mind map, flashcards, quiz |
| 🌗 **Dark Mode** | Full light/dark theme with persistence |
| 📱 **Responsive** | Mobile-friendly layout |

---

## 🛠️ Tech Stack

**Frontend:** React 18 · Vite · Tailwind CSS · React Router · Lucide Icons · React Hot Toast

**Backend:** Node.js · Express.js · Multer · pdf-parse · mammoth

**Database:** MongoDB · Mongoose

**AI:** Google Gemini 1.5 Flash (`@google/generative-ai`)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ → [nodejs.org](https://nodejs.org)
- **MongoDB** running locally → [mongodb.com](https://www.mongodb.com/try/download/community)
- **Gemini API Key** → [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 1 — Install Dependencies

```bash
npm install
```

This automatically installs dependencies for both `server/` and `client/`.

### 2 — Configure Environment

```bash
# Copy the example .env
copy server\.env.example server\.env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vision-notebook-ai
GEMINI_API_KEY=your_actual_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

### 3 — Start MongoDB

```bash
# Windows (if installed as service, it may already be running)
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

### 4 — Run the App

```bash
npm run dev
```

This starts:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:5173`

---

## 📁 Project Structure

```
vision-notebook-ai/
├── package.json              ← Root monorepo runner
│
├── server/
│   ├── server.js             ← Express entry point
│   ├── package.json
│   ├── .env                  ← Your environment variables
│   ├── models/               ← Mongoose schemas
│   │   ├── Document.js
│   │   ├── Image.js
│   │   ├── ChatSession.js
│   │   └── Note.js
│   ├── routes/               ← API route definitions
│   ├── controllers/          ← Business logic
│   ├── middleware/           ← Multer upload, error handling
│   ├── services/
│   │   └── geminiService.js  ← All Gemini AI calls
│   └── uploads/              ← Uploaded files (auto-created)
│
└── client/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── index.css
        ├── api/index.js      ← Axios API layer
        ├── context/          ← ThemeContext, AppContext
        ├── components/       ← Sidebar, Header, ChatBubble, NoteCard, etc.
        └── pages/            ← Dashboard, DocumentUpload, ImageAnalysis, Chat, Notes, Settings
```

---

## 🔌 REST API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/upload` | Upload & process document |
| `GET` | `/api/documents` | List all documents |
| `GET` | `/api/documents/:id` | Get single document |
| `DELETE` | `/api/documents/:id` | Delete document |
| `POST` | `/api/images/upload` | Upload & analyze image |
| `GET` | `/api/images` | List all images |
| `POST` | `/api/images/ask` | Ask question about image |
| `DELETE` | `/api/images/:id` | Delete image |
| `POST` | `/api/chat` | Send chat message |
| `GET` | `/api/chat/sessions` | List all chat sessions |
| `GET` | `/api/chat/history` | Get history overview |
| `POST` | `/api/notes/generate` | Generate notes |
| `GET` | `/api/notes` | List all notes |
| `DELETE` | `/api/notes/:id` | Delete note |
| `GET` | `/api/health` | Server health check |

---

## 📝 Note Types

| Type ID | Name | Description |
|---|---|---|
| `short-summary` | Short Summary | 2-3 sentence overview |
| `detailed-summary` | Detailed Summary | Introduction, main points, conclusion |
| `bullet-notes` | Bullet Notes | Sectioned bullet points |
| `mind-map` | Mind Map | Central topic with branches |
| `flashcards` | Flashcards | Interactive Q&A study cards |
| `quiz-questions` | Quiz | Multiple choice questions with scoring |

---

## 🔧 Troubleshooting

**MongoDB connection error:**
```
Make sure MongoDB is running: mongod --dbpath C:\data\db
```

**Gemini API errors:**
```
Check your GEMINI_API_KEY in server/.env
Get a free key at: https://aistudio.google.com/app/apikey
```

**Upload fails:**
```
Ensure server/uploads/ directory exists (auto-created on first start)
```

**Port conflict:**
```
Change PORT in server/.env or kill the process on port 5000
```

---

## 📄 License

MIT — built with ❤️ using Google Gemini AI
