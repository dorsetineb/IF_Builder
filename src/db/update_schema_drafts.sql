-- Add status column to posts table to support Drafts vs Published
alter table public.posts 
add column if not exists status text default 'published' check (status in ('draft', 'published'));

-- Update RLS to allow authors to see their own drafts, but public only sees published
drop policy if exists "Posts are viewable by everyone" on public.posts;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using ( status = 'published' );

create policy "Authors can view their own posts (including drafts)"
  on public.posts for select
  using ( auth.uid() = author_id );
