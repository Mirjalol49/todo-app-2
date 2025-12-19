-- 1. User Profiles for Gamification
create table user_profiles (
  user_id uuid references auth.users(id) primary key,
  points integer default 0,
  level integer default 1,
  current_streak integer default 0,
  last_active_date date default current_date
);

-- Enable RLS for profiles
alter table user_profiles enable row level security;

create policy "Users can view their own profile" on user_profiles
  for select using (auth.uid() = user_id);

create policy "Users can update their own profile" on user_profiles
  for update using (auth.uid() = user_id);

-- 2. Achievements Definitions
create table achievements (
  id serial primary key,
  name text not null,
  description text,
  points_threshold integer
);

-- Seed some basic achievements
insert into achievements (name, description, points_threshold) values
  ('First Step', 'Complete your first task', 50),
  ('Novice Achiever', 'Reach 500 points', 500),
  ('Task Master', 'Reach 1000 points', 1000);

-- Enable RLS for achievements
alter table achievements enable row level security;
-- Everyone can read achievements
create policy "Anyone can read achievements" on achievements
  for select to authenticated using (true);

-- 3. User Achievements (Many-to-Many)
create table user_achievements (
  user_id uuid references user_profiles(user_id) not null,
  achievement_id integer references achievements(id) not null,
  unlocked_at timestamp with time zone default now(),
  primary key (user_id, achievement_id)
);

alter table user_achievements enable row level security;

create policy "Users can view their accolades" on user_achievements
  for select using (auth.uid() = user_id);

-- 4. Triggers & Functions

-- A. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- B. Award Points on Task Completion
create or replace function add_points_on_completion()
returns trigger as $$
begin
  -- Only run if is_complete changed to true
  if new.is_complete = true and old.is_complete = false then
    update user_profiles
    set points = points + 50
    where user_id = new.user_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_todo_completed
  after update on todos
  for each row execute procedure add_points_on_completion();

-- C. Level Up Logic (Trigger on points update)
create or replace function check_level_up()
returns trigger as $$
declare
  new_level int;
begin
  -- Simple formula: Level = 1 + floor(points / 500)
  new_level := 1 + floor(new.points / 500);
  
  if new_level > new.level then
    new.level := new_level;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_points_updated
  before update on user_profiles
  for each row execute procedure check_level_up();

-- D. Award Badge Logic (Trigger on points update)
create or replace function check_badges()
returns trigger as $$
declare
  badge record;
begin
  for badge in select * from achievements loop
    if new.points >= badge.points_threshold then
      -- Insert if not exists (upsert logic valid here too but simple insert with ignore is fine for sql script)
      insert into user_achievements (user_id, achievement_id)
      values (new.user_id, badge.id)
      on conflict do nothing;
    end if;
  end loop;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_points_updated_badges
  after update on user_profiles
  for each row execute procedure check_badges();
