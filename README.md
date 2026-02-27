# tofuOS - Team Guide 🧊

Welcome to **tofuOS**, an AI-powered product management workspace. This guide will help you get the project running locally and connected to our cloud services.

## 🛠 Tech Stack & Services

| Service | Tool | Purpose | Link |
| :--- | :--- | :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/) | App Framework (App Router) | - |
| **Auth & DB** | [Supabase](https://supabase.com/) | User Login & Postgres Database | [Dashboard](https://supabase.com/dashboard) |
| **AI Processing** | [OpenAI](https://openai.com/) | Insights Generation (GPT-4o-mini) | [API Keys](https://platform.openai.com/api-keys) |
| **Ticketing** | [Jira Cloud](https://atlassian.com/software/jira) | Issue Tracking & Project Management | [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens) |

---

## 🚀 Getting Started

### 1. Configure Your Environment
Create a file named `.env.local` in the root folder and add your specific keys:

```text
# Supabase (Found in Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (Currently in Mock Mode for testing)
OPENAI_API_KEY=your_openai_api_key
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

## 💡 Pro Tips for the Team

- **AI Analysis**: Currently, the app is in **Mock Mode** for AI insights. This means you can test the "Analyze sources" button for free without using OpenAI credits.
- **Jira Integration**: To create a real ticket, you'll need a **Jira API Token**. You only need to enter your details once; the app saves them to your private Supabase profile.
- **Project Keys**: When creating a Jira ticket, make sure to use your project's **Key** (e.g., `KAN` or `DEV`). You can find this key next to your project name in Jira.
