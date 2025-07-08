# code-resolve

Code-Resolve is a platform to save, revise, and practice DSA and competitive programming problems. Store problems by platform, difficulty, language, and code for easy tracking.

---

## 🚀 Features

- Save problems with metadata (name, link, platform, difficulty, status, language)
- Auto-detect platform from URL (LeetCode, Codeforces, etc.)
- Monaco-powered code editor with language highlighting
- Clerk-based authentication to manage user-specific problems
- PostgreSQL database with Prisma ORM

---

## 🛠️ Getting Started (Local Setup)

1. **Clone the repo**

```bash
git clone https://github.com/your-username/code-resolve.git
cd code-resolve
```

2. **Create `.env` file**
   Use `copy.env` as a reference for required environment variables.

3. **Install dependencies**

```bash
npm install
```

4. **Setup database**

```bash
npx prisma migrate dev
```

5. **Run the app**

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## ✅ Tech Stack

- Next.js App Router
- Prisma + PostgreSQL (Neon)
- Clerk for auth
- React Hook Form + Zod
- TailwindCSS + ShadCN UI
- Monaco Editor

---
