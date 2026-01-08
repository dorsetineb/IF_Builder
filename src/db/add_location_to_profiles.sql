-- Add location column to profiles table
alter table public.profiles 
add column if not exists location text;

-- Update the handle_new_user function to include location
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username, location)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    -- Default username from metadata or email part
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'location'
  );
  return new;
end;
$$ language plpgsql security definer;
