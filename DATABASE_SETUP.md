# Database Setup Instructions for v0/Vercel

This guide will help you set up a free database for your PSY360 Survey application.

## Option 1: Supabase (Recommended - Easiest Free Setup)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the project to be provisioned (takes ~2 minutes)

### Step 2: Create Database Table
1. In your Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the table:

```sql
CREATE TABLE survey_results (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  round1_results JSONB NOT NULL,
  tournament_results JSONB NOT NULL,
  final_ranking JSONB NOT NULL,
  complete_ranking_table JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index for faster queries
CREATE INDEX idx_survey_results_timestamp ON survey_results(timestamp);
CREATE INDEX idx_survey_results_name ON survey_results(last_name, first_name);
```

### Step 3: Get API Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** (SUPABASE_URL)
3. Copy your **anon/public key** (SUPABASE_ANON_KEY)

### Step 4: Configure Environment Variables in v0
1. In your v0 project settings, add these environment variables:
   - `SUPABASE_URL` = your project URL
   - `SUPABASE_ANON_KEY` = your anon key

### Step 5: Install Dependencies
Add to your `package.json`:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

### Step 6: Update API Route
Uncomment the Supabase code in `api/submit-survey.ts` and remove the console.log placeholder.

---

## Option 2: Vercel Postgres (If Already Using Vercel)

### Step 1: Create Vercel Postgres Database
1. In your Vercel dashboard, go to **Storage**
2. Click **Create Database** → **Postgres**
3. Choose the **Hobby** plan (free tier)
4. Create the database

### Step 2: Create Database Table
1. Go to your database in Vercel dashboard
2. Click **Query** tab
3. Run this SQL:

```sql
CREATE TABLE survey_results (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  round1_results JSONB NOT NULL,
  tournament_results JSONB NOT NULL,
  final_ranking JSONB NOT NULL,
  complete_ranking_table JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_survey_results_timestamp ON survey_results(timestamp);
CREATE INDEX idx_survey_results_name ON survey_results(last_name, first_name);
```

### Step 3: Get Connection String
1. In your database settings, copy the **Connection String**
2. Vercel automatically sets `POSTGRES_URL` environment variable

### Step 4: Install Dependencies
```json
{
  "dependencies": {
    "@vercel/postgres": "^0.5.1"
  }
}
```

### Step 5: Update API Route
Uncomment the Vercel Postgres code in `api/submit-survey.ts` and remove the console.log placeholder.

---

## Testing Your Setup

1. Complete a survey in your app
2. Click "SUBMIT SURVEY"
3. Check your database:
   - **Supabase**: Go to **Table Editor** → `survey_results`
   - **Vercel Postgres**: Go to **Storage** → your database → **Data** tab

## Querying Your Data

### Supabase Example:
```sql
-- Get all submissions
SELECT * FROM survey_results ORDER BY timestamp DESC;

-- Get submissions by name
SELECT * FROM survey_results 
WHERE first_name ILIKE '%John%' OR last_name ILIKE '%Doe%';

-- Get ranking table for a specific submission
SELECT complete_ranking_table FROM survey_results WHERE id = 1;
```

### Export Data:
Both Supabase and Vercel Postgres allow you to export data as CSV or JSON from their dashboards.

---

## Troubleshooting

- **"Module not found"**: Make sure you've installed the database package (`@supabase/supabase-js` or `@vercel/postgres`)
- **"Environment variable not set"**: Check that you've added the environment variables in v0/Vercel project settings
- **"Table doesn't exist"**: Make sure you've run the CREATE TABLE SQL in your database
- **CORS errors**: v0/Vercel should handle CORS automatically for API routes

---

## Free Tier Limits

- **Supabase**: 500MB database, 2GB bandwidth/month
- **Vercel Postgres**: 256MB database, 60 hours compute/month

Both are sufficient for survey data collection!

