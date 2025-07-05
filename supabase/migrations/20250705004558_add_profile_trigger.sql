-- Profile auto-creation trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Profile RLS policies
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Enable RLS on reveals table
alter table public.reveals enable row level security;

-- Reveals RLS policies
create policy "Users can view own reveals" 
  on reveals for select 
  using (auth.uid() = user_id);

create policy "Users can insert own reveals" 
  on reveals for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own reveals" 
  on reveals for update 
  using (auth.uid() = user_id);

create policy "Users can delete own reveals" 
  on reveals for delete 
  using (auth.uid() = user_id);

-- Public policy for shared links
create policy "Anyone can view reveals by share_slug" 
  on reveals for select 
  using (share_slug is not null);