# Contributing to Trip Desk

Thank you for contributing! Please follow these guidelines to ensure code quality and consistency.

## Code of Conduct

Be respectful, inclusive, and professional in all interactions.

## Getting Started

### 1. Fork and Clone
```bash
git clone https://github.com/your-username/trip-desk.git
cd trip-desk
npm install
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Set Up Environment
```bash
cp .env.example .env.local
# Fill in your development credentials
npm run dev
```

## Development Workflow

### Before Coding
- Check existing GitHub issues and PRs to avoid duplicates
- Discuss major changes in an issue first
- Update your branch: `git pull origin main`

### While Coding

#### TypeScript & Type Safety
- ✅ Enable strict mode (already configured)
- ✅ Export types and interfaces
- ✅ Use `as const` for string literals
- ❌ Avoid `any` type

```typescript
// Good
interface User {
  id: string
  name: string
}

// Bad
const user: any = getUserData()
```

#### Code Style
- Use ESLint: `npm run lint`
- Format code consistently
- Keep functions small and focused
- Add comments for complex logic

#### Testing Your Changes
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build (catches most errors)
npm run build

# Local test
npm run dev
```

#### Environment Variables
```bash
# ✅ OK - Public variables
const url = process.env.NEXT_PUBLIC_SUPABASE_URL

// ❌ WRONG - Never expose secrets
const key = process.env.SUPABASE_SERVICE_ROLE_KEY // Don't use in browser code
```

#### Database Changes
If you modify the database schema:
1. Create a new migration file: `supabase/migrations/000X_description.sql`
2. Test locally: `supabase db push`
3. Include migration in PR description
4. Update `prod.md` if it affects deployment

#### Security Best Practices
- Never hardcode secrets or API keys
- Validate user input with Zod
- Escape output to prevent XSS
- Use server actions for mutations
- Enforce RLS in database queries
- See [.github/SECURITY.md](./.github/SECURITY.md)

### Commit Messages

Follow conventional commits for clear history:

```bash
# Features
git commit -m "feat: add WhatsApp draft feature"

# Bug fixes
git commit -m "fix: resolve lead filtering issue"

# Documentation
git commit -m "docs: update deployment guide"

# Styling/Formatting
git commit -m "style: format lead table component"

# Tests
git commit -m "test: add validation tests"

# Chores
git commit -m "chore: update dependencies"
```

Format: `<type>: <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`

## Making a Pull Request

### PR Checklist
- [ ] Code builds: `npm run build`
- [ ] Tests pass: `npm run lint && npm run type-check`
- [ ] No console errors in dev mode
- [ ] Committed changes are focused (no unrelated changes)
- [ ] Commit messages follow conventional commits
- [ ] Updated relevant documentation
- [ ] Added comments for complex logic

### PR Description
Include the following:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (fixes issue #)
- [ ] New feature (feature #)
- [ ] Breaking change (describe breaking changes)
- [ ] Documentation

## Testing
Describe testing performed:
- Manual testing on: (browser/devices)
- Tested endpoints: (list relevant API routes)

## Screenshots (if applicable)
Add before/after screenshots

## Checklist
- [ ] Follows code style guidelines
- [ ] Self-review completed
- [ ] Tested on multiple browsers
- [ ] No console warnings/errors
```

### Review Process
1. GitHub Actions runs automated tests
2. At least one maintainer reviews
3. Approval required before merge
4. Branch must be up to date
5. All conversations resolved

## Common Tasks

### Adding a New Feature

1. **Create component/page**
   ```bash
   # For UI components
   src/components/admin/MyNewComponent.tsx
   
   # For pages
   src/app/admin/new-page/page.tsx
   ```

2. **Add types**
   ```typescript
   // src/types/index.ts
   export interface MyType {
     id: string
     name: string
   }
   ```

3. **Create validation**
   ```typescript
   // src/lib/validations/my-schema.ts
   import { z } from 'zod'
   
   export const mySchema = z.object({
     name: z.string().min(1),
   })
   ```

4. **Create server action** (if needed)
   ```typescript
   // src/lib/actions/my-action.ts
   'use server'
   
   export async function myServerAction(data: MyType) {
     // Implementation
   }
   ```

5. **Create component**
   ```typescript
   // src/components/admin/MyComponent.tsx
   'use client'
   
   export function MyComponent({ data }: { data: MyType }) {
     return <div>...</div>
   }
   ```

### Adding API Route

```typescript
// src/app/api/my-endpoint/route.ts
import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth/require-admin'

export async function POST(request: Request) {
  // Check authentication
  const { supabase, unauthorized } = await requireAdminSession()
  if (unauthorized) return unauthorized
  
  try {
    // Implementation
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Adding Database Migration

```sql
-- supabase/migrations/0004_new_feature.sql
-- Description: Add new feature to the database

-- Create table
CREATE TABLE IF NOT EXISTS new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT now(),
  -- columns...
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Allow authenticated users" ON new_table
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

## Debugging Tips

### Enable Debug Logging
```typescript
// Use custom logger, not console
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}
```

### Check Environment Variables
```bash
# Verify they're loaded
vercel env list
```

### Test TypeScript Compilation
```bash
npm run type-check
```

### Build Errors
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Performance Considerations

- Use Next.js Image component for images
- Lazy load heavy components
- Debounce search inputs
- Optimize database queries
- Monitor Core Web Vitals

## Documentation

### Code Comments
```typescript
// Use for complex logic only, not obvious code
// Don't over-comment

// Example: WHY not WHAT
const isOverdue = date < today // Business rule: past due date = overdue
```

### Update Docs If You Change:
- Database schema → Update migrations
- API routes → Update `prod.md`
- Environment variables → Update `.env.example`
- Build process → Update this file
- Architecture → Update docs/decisions.md

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Validation](https://zod.dev)

## Questions?

- Check existing issues/discussions
- Ask in PR comments
- Refer to [prod.md](./prod.md) for deployment questions
- See [.github/SECURITY.md](./.github/SECURITY.md) for security questions

## Recognition

Contributors are recognized in:
- GitHub contributors list
- Release notes
- Thank you comment in merged PR

## License

By contributing, you agree your code will be licensed under the same license as this project.

---

Thank you for contributing to Trip Desk! 🚀
