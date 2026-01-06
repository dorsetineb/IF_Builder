-- Force add status column if it doesn't exist
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name = 'posts' and column_name = 'status') then
    alter table public.posts add column status text default 'published' check (status in ('draft', 'published'));
  end if;
end $$;

-- Re-apply policies to be sure
drop policy if exists "Posts are viewable by everyone" on public.posts;
drop policy if exists "Published posts are viewable by everyone" on public.posts;
drop policy if exists "Authors can view their own posts (including drafts)" on public.posts;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using ( status = 'published' );

create policy "Authors can view their own posts (including drafts)"
  on public.posts for select
  using ( auth.uid() = author_id );

-- Ensure INSERT policy exists
drop policy if exists "Authenticated users can create posts" on public.posts;
create policy "Authenticated users can create posts"
  on public.posts for insert
  with check ( auth.uid() = author_id );

-- Ensure UPDATE policy exists
drop policy if exists "Users can update their own posts" on public.posts;
create policy "Users can update their own posts"
  on public.posts for update
  using ( auth.uid() = author_id );
