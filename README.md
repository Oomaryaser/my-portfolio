This project uses [Next.js](https://nextjs.org) and stores data on
[Supabase](https://supabase.com). Images are saved in a public storage bucket so
large binaries do not bloat the database. Only the image URLs are kept in the
tables which keeps queries fast and efficient.

## Getting Started

### 1. Configure Supabase

1. [Create a free Supabase project](https://app.supabase.com/).
2. In **Table Editor** create a table called `categories` with these fields:
   - `id` – integer, primary key, auto increment.
   - `name` – text, not null.
   - `cover_url` – text.
3. Create another table `images` with:
   - `id` – integer, primary key, auto increment.
   - `image_url` – text, not null.
   - `category_id` – integer reference to `categories.id`.
4. In **Storage** create a bucket named `images` and enable public access.
5. Enable **Row Level Security** on the `categories` and `images` tables.
6. Grab your project's `SUPABASE_URL`, `SUPABASE_ANON_KEY` and
   `SUPABASE_SERVICE_ROLE_KEY` from the project settings and create a
   `.env.local` file:

   ```env
   SUPABASE_URL=your-project-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 2. Install dependencies and run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).
Make sure to add the `SUPABASE_URL`, `SUPABASE_ANON_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` environment variables in your project
settings on Vercel.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying)
for more details.
