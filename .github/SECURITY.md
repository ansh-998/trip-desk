# Security Policy

## Reporting Security Vulnerabilities

**Do not** open public GitHub issues for security vulnerabilities.

If you discover a security vulnerability, please email the maintainers privately instead of using the issue tracker.

## Security Best Practices

### Environment Variables

- ✅ **Public variables** (prefixed with `NEXT_PUBLIC_`): Safe to expose in browser
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

- 🔒 **Secret variables** (no prefix): Must NEVER be exposed
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GEMINI_API_KEY`

### Never commit secrets to Git

```bash
# Good: .gitignore protects these
.env
.env.local
.env.*.local

# Bad: Never hardcode secrets
GEMINI_API_KEY=sk-1234567890abcdef
```

### Set secrets in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add each secret with appropriate environment (Production, Preview, Development)
5. Never share or expose these values

### Code Security

- Never log sensitive information (API keys, user data, etc.)
- Always validate and sanitize user input
- Use Zod for runtime type validation
- Enable RLS (Row Level Security) in Supabase
- Keep dependencies up to date (Dependabot enabled)

### Database Security

- All queries enforce Supabase RLS policies
- Service role key used only for server-side operations
- Auth tokens stored in secure HTTP-only cookies

## Dependency Updates

We use Dependabot to automatically check for security updates:

- Weekly dependency checks
- Automatic pull requests for updates
- Security alerts for known vulnerabilities

## Vercel Deployment Security

- All environment variables are encrypted
- HTTPS enforced automatically
- DDoS protection included
- Web Application Firewall (WAF) available

## Questions?

For security concerns, please contact the maintainers privately.
