# 🌍 AI Multi-Agent Travel Planner

[![CI/CD Pipeline](https://github.com/travelplanner/ai-travel-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/travelplanner/ai-travel-planner/actions)
[![Java 21/25](https://img.shields.io/badge/Java-21%20%7C%2025-orange.svg)](https://openjdk.org/projects/jdk/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.3.5-881337.svg)](https://tailwindcss.com/)
[![Theme](https://img.shields.io/badge/Theme-Maroon%20Luxury%20Palette-800020.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-red.svg)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.5%20Flash-8e75ff.svg)](https://ai.google.dev/)

An enterprise-grade, commercial-ready **AI Multi-Agent Travel Planner** SaaS application that empowers travelers to discover global destinations, design personalized itineraries, compare airfares and boutique hotels, optimize budgets, and manage reservations using 11 specialized autonomous AI agents working collaboratively.

---

## 🎨 Design System & Maroon Theme Variations

The application features a modern responsive UI crafted with a luxury **Maroon** palette, fluid typography, responsive action buttons with vector logos, interactive toast notifications, and dark and light theme options:

- **Maroon Primary Palette**: `#800020` (Classic Maroon), `#881337` (Deep Wine/Maroon Base), `#9f1239` (Rose Maroon Hover), `#4c0519` (Obsidian Maroon Deep), and `#fb7185` (Rose Glow Accent).
- **Light Theme**: Ultra-clean `#fdfafb` surface with crisp porcelain cards, subtle rose-maroon borders (`#f4e1e5`), deep maroon typography, and interactive toast feedback.
- **Dark Theme**: Deep `#0d0608` obsidian maroon canvas with `#160a0f` glassmorphic cards, `#33151f` wine borders, and glowing rose-maroon telemetry accents.
- **Responsive Typography & Icons**: Fluid scalable font metrics across mobile, tablet, and widescreen layouts, accented with vector BrandLogo crests and Lucide icons.
- **Interactive Toast Notifications**: Contextual toast popups across user actions (wishlist updates, trip generation, expense additions, PDF exports, and booking links).

---

## 📸 User Interface Gallery (Light & Dark Theme Views)

Here are the visual walkthroughs of all light mode application pages and the dark theme dashboard, presented **2 per line**:

| View 1 | View 2 |
| :---: | :---: |
| **01. Landing & Exploration Hero**<br>![Landing Page](docs/screenshots/01-landing.png) | **02. Executive Dashboard (Light)**<br>![Dashboard](docs/screenshots/02-dashboard.png) |
| **03. AI Multi-Agent Natural Language Planner**<br>![AI Planner](docs/screenshots/03-planner.png) | **04. 5-Step Trip Planning Wizard**<br>![Wizard](docs/screenshots/04-wizard.png) |
| **05. Worldwide Destinations Catalog**<br>![Destinations](docs/screenshots/05-destinations.png) | **06. Destination Intelligence & Advisory**<br>![Destination Details](docs/screenshots/06-destination-detail.png) |
| **07. Flight Discovery & Baggage Analysis**<br>![Flights](docs/screenshots/07-flights.png) | **08. Hotel & Boutique Accommodations**<br>![Hotels](docs/screenshots/08-hotels.png) |
| **09. Hotel Amenities & Direct Booking**<br>![Hotel Details](docs/screenshots/09-hotel-detail.png) | **10. Day-by-Day Optimized Itinerary**<br>![Itinerary](docs/screenshots/10-itinerary.png) |
| **11. Budget Analytics & Expense Tracker**<br>![Budget](docs/screenshots/11-budget.png) | **12. Interactive Geospatial Route Map**<br>![Route Map](docs/screenshots/12-map.png) |
| **13. Reservation & PNR Booking Tracker**<br>![Bookings](docs/screenshots/13-bookings.png) | **14. AI Travel Concierge Chat Swarm**<br>![Chat](docs/screenshots/14-chat.png) |
| **15. Distributed Agent Swarm Telemetry**<br>![Agent Monitoring](docs/screenshots/15-agent-monitoring.png) | **16. My Trips & Expeditions Roster**<br>![My Trips](docs/screenshots/16-trips.png) |
| **17. Saved Destinations & Wishlist**<br>![Saved Destinations](docs/screenshots/17-saved-destinations.png) | **18. Cluster & Admin Operations Console**<br>![Admin Console](docs/screenshots/18-admin.png) |
| **19. User Profile & Travel DNA**<br>![User Profile](docs/screenshots/19-profile.png) | **20. System & AI Model Configuration**<br>![Settings](docs/screenshots/20-settings.png) |
| **21. Real-Time Notification Center**<br>![Notifications](docs/screenshots/21-notifications.png) | **22. Authentication Sign-In**<br>![Login](docs/screenshots/22-login.png) |
| **23. New Traveler Onboarding & Registration**<br>![Register](docs/screenshots/23-register.png) | **24. Executive Dashboard (Dark Theme)**<br>![Dashboard Dark](docs/screenshots/24-dashboard-dark.png) |

---

## 🏛 Architecture & Multi-Agent Swarm

The system employs a centralized **Orchestrator Agent** that coordinates a swarm of 11 domain-specialized autonomous agents communicating over a shared execution context.

```mermaid
flowchart TD
    User([User Prompt / Wizard]) --> Orchestrator[Orchestrator Agent]
    
    subgraph MultiAgentSwarm [Autonomous Specialized Agent Swarm]
        direction TB
        subgraph Phase1 [Phase 1: Parallel Discovery]
            Research[Travel Research Agent]
            Flight[Flight Search Agent]
            Hotel[Hotel Recommendation Agent]
            Weather[Weather Agent]
            Safety[Travel Safety Agent]
            Food[Food & Restaurant Agent]
        end
        
        subgraph Phase2 [Phase 2: Transit & Sequencing]
            Transport[Transportation Agent]
            Itinerary[Itinerary Planning Agent]
        end
        
        subgraph Phase3 [Phase 3: Financials & Audit]
            Budget[Budget Management Agent]
            Critic[Travel Critic Agent]
        end
        
        subgraph Phase4 [Phase 4: Execution]
            Booking[Booking Assistant Agent]
        end
    end
    
    Orchestrator --> Phase1
    Phase1 --> Phase2
    Phase2 --> Phase3
    Critic -- Revisions Needed --> Itinerary
    Critic -- Approved (100% Feasibility) --> Phase4
    Phase4 --> UI([Interactive Next.js Frontend])
```

### Agent State Machine

Every task executed within the orchestration engine transitions through a formal state machine:

```
[ PENDING ] ──► [ RUNNING ] ──┬──► [ COMPLETED ]
                   ▲          │
                   │          └──► [ FAILED ] ──► [ RETRYING ] ──► (retry loop)
                   │
                   └───────────────── [ WAITING_FOR_USER ]
```

### The 11 Autonomous Specialized Agents

| # | Agent Name | Primary Responsibility & Toolset |
|---|---|---|
| **1** | **Travel Research Agent** | Destination discovery, seasonal highlights, hidden gems, and cultural etiquette via `AttractionTool`. |
| **2** | **Flight Search Agent** | Live airfare querying, non-stop vs layovers, baggage rules, and booking links via `FlightSearchTool`. |
| **3** | **Hotel Recommendation Agent** | Star rating matching, boutique/luxury tiers, distance to city centers, and amenities via `HotelSearchTool`. |
| **4** | **Itinerary Planning Agent** | Geospatial sight clustering, morning/afternoon/evening day-wise sequencing, and duration estimation. |
| **5** | **Budget Management Agent** | Granular line-item estimation, multi-currency conversion, expense tracking, and 15% contingency buffers. |
| **6** | **Transportation Agent** | Airport transfers, metro passes, walking routes, and transit duration calculations. |
| **7** | **Weather Agent** | Climate forecasts, seasonal rain checks, suitable packing lists, and indoor alternate activities via `WeatherTool`. |
| **8** | **Food & Restaurant Agent** | Regional delicacies, vegetarian/vegan options, dietary filters, and landmark dining via `RestaurantTool`. |
| **9** | **Travel Safety Agent** | Official safety advisories, 24/7 emergency contacts, tourist scam prevention, and visa prerequisites. |
| **10** | **Travel Critic Agent** | Rigorous feasibility auditing, transit bottleneck detection, opening hour validation, and revision triggering. |
| **11** | **Booking Assistant Agent** | PNR tracking, reservation confirmation management, provider vouchers, and cancellation terms. |

---

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.1.7 (App Router), React 19.0.0, TypeScript 5.7.2
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS v4.3.5 with `@tailwindcss/postcss`
- **Design Language**: Rich Maroon variations (`#800020`, `#881337`, `#9f1239`, `#be123c`, `#fb7185`)
- **Component Primitives**: Lucide React icons, Framer Motion
- **Visuals & Charts**: Recharts (Pie & Bar analytics), Mapbox GL JS (Vector mapping)
- **Forms & Validation**: React Hook Form, Zod
- **Export & Utility**: jsPDF (PDF itinerary generator), Canvas Confetti

### Backend
- **Runtime**: Java 21 / Java 25 LTS
- **Core Framework**: Spring Boot 3.4.2
- **Security**: Spring Security 6 with JJWT 0.12.6, BCrypt, RBAC, and refresh token rotation
- **Persistence**: Spring Data JPA, Hibernate, Flyway Migration (V1 Schema + V2 Seed Data)
- **Database Engine**: PostgreSQL 16 directly (with pgvector extension) & H2 zero-setup fallback
- **Caching & Locks**: Redis 7
- **API Spec**: Springdoc OpenAPI 2.8.5 with Swagger UI Console
- **Testing**: JUnit 5, Mockito, Spring Boot Test (`-XX:+EnableDynamicAgentLoading`)

### AI Integration
- **Primary LLM**: Google Gemini API (`gemini-2.5-flash` with sub-500ms latency)
- **Alternative Providers**: OpenAI API (`gpt-4o`), Ollama (`llama3.2`)
- **Fault-Tolerance**: Intelligent deterministic fallback engine active when offline or without API keys

---

## 🚀 Quick Start Guide

### Option A: Local Dev (Zero External Dependencies)

#### 1. Start the Backend
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```
- REST API: `http://localhost:8081/api`
- OpenAPI Swagger UI: `http://localhost:8081/swagger-ui.html`

#### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
- Web Application: `http://localhost:3000`

Default Demo Credentials:
- **Email**: `demo@travelplanner.ai`
- **Password**: `Password123!`

---

### Option B: Docker Compose (Production Environment)

To launch the full containerized stack including PostgreSQL 16 + pgvector, Redis, Spring Boot Backend, Next.js Frontend, and Nginx reverse proxy:

```bash
docker compose up --build -d
```

Service Endpoints:
- **Nginx Reverse Proxy**: `http://localhost` (Port 80)
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8081`
- **PostgreSQL**: `localhost:5432` (`travelplanner` / `traveluser` / `travelpassword`)
- **Redis**: `localhost:6379`

---

## 🧪 Testing & Verification

### Backend Tests
```bash
cd backend
mvn test
```
All test suites pass:
- `MultiAgentOrchestratorTest`: Verifies parallel discovery, sequential pipeline, and critic audit.
- `TripServiceTest`: Validates natural language entity extraction and trip persistence.
- `AuthServiceTest`: Tests JWT generation, registration, and credential validation.
- `BudgetServiceTest`: Tests expense allocation and buffer arithmetic.

### Frontend Production Build
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
