-- Create post_reactions table
create table if not exists public.post_reactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text check (type in ('like', 'super_like', 'dislike')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- Add parent_id to comments for threading
alter table public.comments add column if not exists parent_id uuid references public.comments(id) on delete cascade;

-- Enable RLS
alter table public.post_reactions enable row level security;

-- Policies for post_reactions
create policy "Public reactions are viewable by everyone"
  on public.post_reactions for select
  using ( true );

create policy "Users can insert their own reactions"
  on public.post_reactions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reactions"
  on public.post_reactions for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reactions"
  on public.post_reactions for delete
  using ( auth.uid() = user_id );
