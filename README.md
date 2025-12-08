# WePhixs — Full‑Stack Web App

## 📖 Overview

WePhixs is a real-time collaborative pixel‑painting platform where users paint on a shared canvas with live updates powered by Socket.IO. The backend is built with NestJS, using Prisma + PostgreSQL to store pixel data, user activity, guild info, and leaderboard stats.
The server applies cooldowns and validation to prevent abuse, while the app includes password reset using Mailcow:Dockerized for SMTP secure one‑time token links.
Users can join or create Guilds, collaborate as groups, climb the daily/weekly/monthly/all‑time Leaderboards, and inspect any pixel to see who placed it and when. A built‑in Report & Feedback System allows users to submit bugs and feature requests directly inside the app.

The frontend is a fully responsive Next.js + TailwindCSS UI. The entire stack is containerized with Docker, deployed on OVH Cloud, having own mail server with mailcow, and served through Caddy with Cloudflare for DNS + SSL.

---
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/12a129c6-fbb3-472c-a836-264c3e1324e4" />

## 📂 Project Structure

```bash
we-phixs/
├── apps/
│   ├── backend/       # NestJS API server
│   └── web/           # Next.js frontend
├── packages/
│   ├── eslint-config/ # Shared ESLint configs
│   ├── types/         # Shared TypeScript definitions
│   └── ui/            # Shared React UI components
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
└── turbo.json
```

---

## ⚙️ Technologies Used

## 🔹 Backend (NestJS)

The backend handles authentication, pixel operations, real‑time events, email flows, and database logic.

**Core Technologies:**

* **NestJS** — modular backend framework
* **Prisma ORM** — PostgreSQL database layer
* **Socket.IO** — real‑time communication
* **bcryptjs** — password hashing
* **class-validator / class-transformer** — dto validation
* **uuid / cuid2** — id generation

---

## 🔹 Frontend (Next.js)

The frontend is built using **Next.js** and **TailwindCSS**, with state management powered by **TanStack React Query**.

**Core UI Libraries:**

* **TailwindCSS** — utility-first styling
* **Framer Motion** — animations
* **Radix UI** — accessible UI primitives
* **Lucide-react** — icons
* **React Toastify** — toast notifications

**Client-Side Data & Utils:**

* **React Query** — mutations, caching, optimistic updates
* **Axios** — API calls
* **Socket.IO client** — real-time events
* **Day.js** — date/time formatting
* **Howler.js** — sound effects
* **Clsx / class-variance-authority** — class handling

---

## 🔑 Features

### ⭐ Authentication

* Email + password auth
* Discord OAuth2
* Forgot password token flow

### ⭐ Pixel / Canvas System

* Real‑time shared pixel board
* Pixel inspection (who placed, when)
* Cooldown logic to prevent abuse

### ⭐ Guild System

* Create / join guilds
* Private boards
* Member and Leader roles
* Leaderboards

### ⭐ Leaderboard System

* Top users on Daily, Weekly, Monthly, and All Time

### ⭐ Own Mailserver

* sending and receiving emails with mailcow:dockerized

---

## 🚀 Deployment

* **Hosting**: OVH Cloud
* **Runtime**: Node.js
* **Reverse Proxy**: Caddy
* **Containerization**: Docker
* **SSL**: Cloudflare (SSL/TLS) configuration
---

## 🐳 Docker Support

The repo includes a `docker-compose.yml` for:

* Backend
* Frontend
* PostgreSQL

## Mailcow: Dockerized

* https://github.com/mailcow/mailcow-dockerized

---
