# tofuOS - Team Guide 🧊

Welcome to **tofuOS**, an AI-powered product management workspace. This guide will help you get the project running locally and connected to our cloud services.

## 🛠 Tech Stack & Services

| Service | Tool | Purpose | Link |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) | App Framework (App Router) | - |
| **Auth & DB** | [Supabase](https://supabase.com/) | User Login & Postgres Database | [Dashboard](https://supabase.com/dashboard) |
| **AI Processing** | [Google Gemini](https://ai.google.dev/) | Insights Generation (1.5 Flash - Free Tier) | [AI Studio](https://aistudio.google.com/) |
| **Ticketing** | [Jira Cloud](https://atlassian.com/software/jira) | Issue Tracking & Project Management | [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens) |

---

## 🚀 Getting Started

### 1. Configure Your Environment
Create a file named `.env.local` in the root folder and add your specific keys:

```text
# Supabase (Found in Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini (Get a free key at https://aistudio.google.com/)
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
```

### 2. Initialize the Database
Go to your **Supabase SQL Editor** and run these two scripts to create our tables:

#### Table: `sources` (For PDF/App Review tracking)
```sql
create table sources (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null,
  selected boolean default true,
  meta jsonb,
  user_id uuid references auth.users(id) on delete cascade not null
);

alter table sources enable row level security;
create policy "Users can manage their own sources" on sources for all using (auth.uid() = user_id);
```

#### Table: `jira_configs` (To save your Jira login only once)
```sql
create table jira_configs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  domain text not null,
  email text not null,
  api_token text not null,
  user_id uuid references auth.users(id) on delete cascade unique not null
);

alter table jira_configs enable row level security;
create policy "Users can manage their own jira config" on jira_configs for all using (auth.uid() = user_id);
```

### 3. Run Locally
Open your terminal in the project folder and run:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see it in action!

---

## 🚢 Deploying to Vercel

To ensure **Sign In** and all features work correctly on Vercel, follow these steps:

1.  **Dependency Conflict Fix**: I have added a `.npmrc` file to the project. This tells Vercel to ignore a common "Peer Dependency" conflict between React 19 and older packages like `next-themes`.
2.  **Add Environment Variables**: In your Vercel Dashboard, go to **Settings -> Environment Variables** and add:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `OPENAI_API_KEY`
2.  **Configure Redirect URLs**: In your **Supabase Dashboard**, go to **Authentication -> URL Configuration** and add your Vercel production URL (e.g., `https://your-app.vercel.app`) to the **Redirect URLs** list. This ensures Supabase can send users back to your app after login.

---

## 💡 Pro Tips for the Team

- **AI Analysis**: The app is currently using **Google Gemini 1.5 Flash**. You can get a free API key at [Google AI Studio](https://aistudio.google.com/). If no key is provided in your `.env.local`, the app will fallback to a Mock Mode for testing.
- **Jira Integration**: To create a real ticket, you'll need a **Jira API Token**. You only need to enter your details once; the app saves them to your private Supabase profile.
- **Project Keys**: When creating a Jira ticket, make sure to use your project's **Key** (e.g., `KAN` or `DEV`). You can find this key next to your project name in Jira.
