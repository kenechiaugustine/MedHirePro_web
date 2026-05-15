-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  user_type text not null check (user_type in ('professional', 'institute')),
  full_name text,
  specialty text,
  facility_name text,
  has_onboarded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, user_type, full_name, specialty, facility_name, has_onboarded)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'user_type',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'specialty',
    new.raw_user_meta_data->>'facility_name',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
