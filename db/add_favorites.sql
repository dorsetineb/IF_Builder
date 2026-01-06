-- Enable RLS (idempotent-ish)
alter table public.post_favorites enable row level security;

-- Policies (Drop first to avoid conflicts if partially applied)
drop policy if exists "Users can view their own favorites" on public.post_favorites;
create policy "Users can view their own favorites"
    on public.post_favorites for select
    using (auth.uid() = user_id);

drop policy if exists "Users can add favorites" on public.post_favorites;
create policy "Users can add favorites"
    on public.post_favorites for insert
    with check (auth.uid() = user_id);

drop policy if exists "Users can remove their favorites" on public.post_favorites;
create policy "Users can remove their favorites"
    on public.post_favorites for delete
    using (auth.uid() = user_id);

-- Ensure users can delete their own posts
drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
    on public.posts for delete
    using (auth.uid() = author_id);
