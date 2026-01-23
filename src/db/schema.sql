-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  full_name text,
  bio text,
  website text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint username_length check (char_length(username) >= 3)
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Trigger for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username, location, is_approved)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'location',
    true
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. CATEGORIES
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone"
  on categories for select
  using ( true );

-- Default Categories with Icons
insert into public.categories (name, slug, description, icon_name) values
('Geral', 'general', 'Discussões gerais sobre ficção interativa', 'MessageSquare'),
('Dúvidas Técnicas', 'help', 'Ajuda com scripts, variáveis e lógica', 'CircleHelp'),
('Showcase', 'showcase', 'Mostre seus projetos e receba feedback', 'Gamepad2'),
('Tutoriais', 'tutorials', 'Compartilhe conhecimento e guias', 'BookOpen'),
('Off-Topic', 'off-topic', 'Conversas aleatórias e networking', 'Coffee');


-- 3. POSTS
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  author_id uuid references public.profiles(id) not null,
  category_id uuid references public.categories(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Posts are viewable by everyone"
  on posts for select
  using ( true );

create policy "Authenticated users can create posts"
  on posts for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own posts"
  on posts for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own posts"
  on posts for delete
  using ( auth.uid() = author_id );


-- 4. COMMENTS
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  content text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
  on comments for select
  using ( true );

create policy "Authenticated users can create comments"
  on comments for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own comments"
  on comments for update
  using ( auth.uid() = author_id );

create policy "Users can delete their own comments"
  on comments for delete
  using ( auth.uid() = author_id );
