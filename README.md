# Apex Academy LMS

Apex Academy LMS is a modern, full-stack Learning Management System designed to bridge the gap between content creators and learners. It features distinct interfaces for public visitors, enrolled students, and platform administrators.

## Features

- **Role-Based Architecture:** Securely isolated environments for Public, Student, and Admin.
- **Advanced Learning Interface:** Custom-built course player supporting dynamic content types (YouTube, PDF).
- **Assessment & Certification Engine:** Built-in module/final assessments and dynamic certificate generation.
- **AI Integration:** Leverage Google GenAI for enhanced learning.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend:** Express.js, PostgreSQL
- **Auth & Database:** Supabase

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:** `npm install` or `bun install`
3. **Environment Variables:** Copy `.env.example` to `.env` and fill in your Supabase and Gemini API credentials.
4. **Run the development server:** `npm run dev`

## License
MIT
