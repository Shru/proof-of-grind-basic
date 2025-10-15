# Environment Variables

## Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

## Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_NAME` | Application name | `Proof of Grind` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |

## Setup

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials
3. Restart the development server

## Security Notes

- The `VITE_SUPABASE_ANON_KEY` is safe to expose in client-side code
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Environment variables prefixed with `VITE_` are exposed to the browser
- All secrets have been removed from the codebase
