# Lahore Estate — Premium Real Estate Platform

A full-stack property discovery & lead generation platform for a single Lahore-based real
estate company, built as described in the product brief: verified properties, verified
agents, AI-powered natural-language property matching, comparison, saved properties, visit
scheduling, and a full admin dashboard.

```
lahore-estate/
  client/   React + Vite + Tailwind frontend
  server/   Node.js + Express + MongoDB backend
```

The frontend works in **two modes**:

1. **Connected mode** — talks to the real backend/MongoDB for live data.
2. **Demo mode** — if the backend is unreachable (or `VITE_USE_BACKEND=false`), the app
   automatically falls back to realistic local demo data (15 Lahore properties, 4 agents),
   so you can open the site and click through every page without running anything else.
   The AI Property Finder also has a local mock matcher, so it works in demo mode too.

This means you can `npm install && npm run dev` in `client/` alone and get a fully working
demo. To get persistence (leads, visits, admin CRUD), run the backend too.

---

## 1. Backend setup (Node.js + Express + MongoDB)

```bash
cd server
cp .env.example .env      # then edit values as needed
npm install
```

You need a MongoDB instance — either local (`mongodb://127.0.0.1:27017/lahore_estate`) or a
free Atlas cluster. Put the connection string in `MONGO_URI` inside `server/.env`.

Seed realistic demo data (15 Lahore properties, 4 agents, 1 admin user):

```bash
npm run seed
```

This prints the seeded admin login, e.g.:

```
Created admin user: admin@lahoreestate.pk / ChangeMe123!
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

The API runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### AI Property Finder — mock vs real

By default `AI_PROVIDER=mock` in `.env`, which uses a fast rule-based NLP extractor
(`server/services/aiMatchService.js`) — no API key required, fully functional.

To use a real LLM for extracting search criteria from natural language, set:

```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

The matching/scoring logic itself (ranking properties, generating "why this matches you"
explanations) is deterministic and rule-based either way, so results stay explainable.

---

## 2. Frontend setup (React + Vite + Tailwind)

```bash
cd client
cp .env.example .env      # then edit values as needed
npm install
npm run dev
```

Opens on `http://localhost:5173`. Key `.env` values:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_COMPANY_NAME=Lahore Estate
VITE_COMPANY_WHATSAPP_NUMBER=923001234567   # no + or spaces
VITE_COMPANY_PHONE_NUMBER=+923001234567
VITE_USE_BACKEND=true                       # set false to force pure demo mode
```

If the backend isn't running, the app detects this automatically (via `/api/health`) and
transparently serves local demo data instead — nothing breaks.

### Admin dashboard

Visit `/admin/login` and sign in with the account created by `npm run seed` (or one you
create via `POST /api/auth/register`, which requires an existing admin token). From there:

- **Dashboard** — property/lead/visit stats
- **Properties** — list, add, edit, delete, toggle verification
- **Add Property** — full form matching the Property schema
- **Leads** — every inquiry, WhatsApp click, call request, and AI search becomes a lead here
- **Visit Requests** — manage scheduled visits and their status
- **Agents** — add/verify/remove in-house agents
- **Verification** — quick approve/reject queue for pending properties
- **Analytics** — simple distribution charts by area and property type
- **Settings** — reference for all environment variables

Admin write routes (`POST`/`PUT`/`DELETE` on properties/agents, and all of leads/visits GET)
require a valid JWT from `/api/auth/login`. Public routes — property browsing, lead
creation, visit creation, AI matching — need no auth, since customers aren't required to
sign in.

---

## 3. Project structure

```
server/
  controllers/   Route handlers (auth, property, agent, lead, visit, ai)
  models/        Mongoose schemas (User, Property, Agent, Lead, Visit)
  routes/        Express routers, mounted under /api/*
  middleware/    JWT auth, role-based authorize(), centralized error handler
  services/      aiMatchService.js — NLP extraction + match scoring (mock + optional LLM)
  seed/          seedData.js — realistic Lahore demo data
  config/db.js   MongoDB connection

client/
  src/
    components/  Reusable UI: PropertyCard, Navbar, AgentCard, ScheduleVisitModal, etc.
    pages/       Route-level views, incl. pages/admin/* for the dashboard
    context/     SavedPropertiesContext, CompareContext, AuthContext (React Context + localStorage)
    services/    api.js (fetch wrapper), aiService.js (mock matcher), dataService.js
                 (unified data layer with automatic backend/demo fallback)
    data/        Local demo dataset (properties.js, agents.js) — mirrors the DB schema
    utils/       format.js — PKR/crore/lakh formatting, WhatsApp link builder, etc.
```

---

## 4. API reference

```
GET    /api/health

POST   /api/auth/login
GET    /api/auth/me                 (auth required)
POST   /api/auth/register           (admin only)

GET    /api/properties              ?purpose&propertyType&area&minPrice&maxPrice&bedrooms
                                     &bathrooms&furnished&parking&verifiedOnly&availableToday
                                     &amenities&q&sort&page&limit
GET    /api/properties/compare      ?ids=id1,id2,id3
GET    /api/properties/:id          (id or slug)
POST   /api/properties              (auth: admin/manager)
PUT    /api/properties/:id          (auth: admin/manager)
DELETE /api/properties/:id          (auth: admin/manager)

GET    /api/agents
GET    /api/agents/:id
POST   /api/agents                  (auth: admin/manager)
PUT    /api/agents/:id              (auth: admin/manager)
DELETE /api/agents/:id              (auth: admin/manager — soft delete)

GET    /api/leads                   (auth required)          ?status&leadType
POST   /api/leads                   (public — every CTA generates a lead)
PUT    /api/leads/:id                (auth required)

GET    /api/visits                  (auth required)          ?status
POST   /api/visits                  (public — customers schedule visits)
PUT    /api/visits/:id               (auth required)

POST   /api/ai/property-match       { query, name?, phone?, saveLead? }
POST   /api/ai/compare-assist       { propertyIds: [...], preference? }
```

---

## 5. Notes & next steps for production

- **Maps**: `LocationMap.jsx` is a styled placeholder. Swap it for a Google Maps/Mapbox
  embed using each property's `coordinates` field once you have an API key.
- **Image uploads**: properties currently take image *URLs* (matching the "images" array in
  the schema). Wire up a provider like Cloudinary/S3 if you want direct uploads from the
  admin form.
- **WhatsApp**: all WhatsApp CTAs use `wa.me` deep links built from
  `COMPANY_WHATSAPP_NUMBER` — no WhatsApp Business API integration is required for this to
  work, but you can swap in the official API later without changing the UI.
- **Security**: passwords are hashed with bcrypt, admin routes are JWT-protected and
  role-gated. Rotate `JWT_SECRET` and the seeded admin password before going live.
