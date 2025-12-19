-- Create a table for public profiles if needed, but for now we focus on todos
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  is_complete boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table todos enable row level security;

-- Policy: Users can view their own todos
create policy "Users can view their own todos" on todos
  for select using (auth.uid() = user_id);

-- Policy: Users can insert their own todos
create policy "Users can insert their own todos" on todos
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own todos
create policy "Users can update their own todos" on todos
  for update using (auth.uid() = user_id);

-- Policy: Users can delete their own todos
create policy "Users can delete their own todos" on todos
  for delete using (auth.uid() = user_id);
