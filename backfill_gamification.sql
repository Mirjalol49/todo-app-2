-- Backfill user_profiles for existing users who missed the signup trigger
insert into public.user_profiles (user_id)
select id from auth.users
where id not in (select user_id from public.user_profiles);

-- Verify triggers are active
comment on trigger on_auth_user_created on auth.users is 'Trigger to create profile on signup';
comment on trigger on_todo_completed on todos is 'Trigger to award points';
