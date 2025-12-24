# Quiz Builder

A full-stack quiz builder application with support for multiple question types (True/False, Short Answer, and Multiple Choice). Built with Next.js, Express, TypeScript, and PostgreSQL.

## Features

- ✨ Create quizzes with multiple question types
- 📝 Support for True/False, Short Answer, and Multiple Choice questions
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔄 Real-time quiz management
- 🗑️ Delete quizzes with confirmation modal
- 📱 Mobile-friendly design

## Prerequisites

- Node.js (v18+)
- Node package manager 

## Setup

### 1. Create a PostgreSQL database

Create database quiz-builder-db in Neon (directly or via Vercel)

Navigate to backend directory with cd backend

Create `.env` file:
   - DATABASE_URL=postgresql://user:password@host/db?sslmode=require (example)
   - PORT=3000
     
Install dependencies and run migrations:
 - npm install
 - npx prisma generate
 - npx prisma migrate deploy

### 2. Start Backend

Open a new terminal:

- cd backend
- npm run dev - Backend runs on `http://localhost:3000`

### 3. Start Frontend

Open a new terminal:

- cd frontend
- npm install
- npm run dev - Frontend runs on `http://localhost:3001` (or next available port)

## Environment Variables

### Backend (`.env`)
- DATABASE_URL=postgresql://user:password@host/db?sslmode=require (example)
- PORT=3000

### Frontend (`.env`)
- NEXT_PUBLIC_API_URL=http://localhost:3000

## Creating a Quiz

1. Navigate to `http://localhost:3001/create`
2. Enter quiz title
3. Add questions using "+ Add Question"
4. Select question type (True/False, Short Answer, or Multiple Choice)
5. Fill in question details and correct answers
6. Click "Create Quiz"

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, Prisma
- Database: PostgreSQL
