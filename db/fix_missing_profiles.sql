-- Backfill profiles for users that exist in auth.users but not in public.profiles
insert into public.profiles (id, username, full_name, avatar_url, updated_at)
select 
  id, 
  -- Try to get username from metadata, fallback to email prefix, fallback to 'user_' + first 8 chars of id
  coalesce(
    raw_user_meta_data->>'username', 
    split_part(email, '@', 1), 
    'user_' || substr(id::text, 1, 8)
  ) as username,
  
  -- Try to get full name from metadata
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)) as full_name,
  
  -- Try to get avatar from metadata
  coalesce(raw_user_meta_data->>'avatar_url', '') as avatar_url,
  
  now()
from auth.users
where id not in (select id from public.profiles);
