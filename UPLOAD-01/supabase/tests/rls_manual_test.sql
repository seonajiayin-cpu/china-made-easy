-- Manual RLS smoke-test script for a disposable Supabase project.
-- Create two confirmed auth users and replace USER_A_UUID / USER_B_UUID.

-- As USER A: expected insert success and own row visible.
-- set role authenticated;
-- select set_config('request.jwt.claim.sub', 'USER_A_UUID', false);
-- select set_config('request.jwt.claim.role', 'authenticated', false);
-- insert into public.trips (user_id, title) values ('USER_A_UUID', 'RLS test trip');
-- select id, title, user_id from public.trips;

-- Switch to USER B: expected zero rows for USER A's trip.
-- reset role;
-- set role authenticated;
-- select set_config('request.jwt.claim.sub', 'USER_B_UUID', false);
-- select set_config('request.jwt.claim.role', 'authenticated', false);
-- select id, title, user_id from public.trips;

-- As USER B, update USER A's trip: expected zero rows affected.
-- update public.trips set title = 'Unauthorized update' where id = 'TRIP_UUID';

-- As USER B, spoof USER A on insert: expected RLS violation.
-- insert into public.trips (user_id, title) values ('USER_A_UUID', 'Spoofed owner');

-- As USER B, own insert/read should succeed.
-- insert into public.trips (user_id, title) values ('USER_B_UUID', 'User B trip');
-- select id, title, user_id from public.trips;

-- Cleanup only in a disposable environment, as a privileged role.
-- reset role;
-- delete from public.trips where title in ('RLS test trip', 'User B trip');
-- Manual checks only; this is not an automated security test.
