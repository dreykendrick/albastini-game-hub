-- ROLES
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create policy "Users can read their own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create or replace function public.grant_admin_for_verified_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email_confirmed_at is not null
     and lower(new.email) = 'admin@albastini.com' then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_grant_admin
after insert on auth.users
for each row execute function public.grant_admin_for_verified_email();

create trigger on_auth_user_confirmed_grant_admin
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
execute function public.grant_admin_for_verified_email();

-- UPDATED AT HELPER
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- TOURNAMENT SETTINGS (single row)
create table public.tournament_settings (
  id uuid primary key default gen_random_uuid(),
  tournament_number integer not null default 25,
  name text not null default 'Albastini Tournament',
  starts_at timestamptz not null default now(),
  prize_pool text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.tournament_settings to anon;
grant select, insert, update, delete on public.tournament_settings to authenticated;
grant all on public.tournament_settings to service_role;
alter table public.tournament_settings enable row level security;

create policy "Tournament settings are public"
on public.tournament_settings for select to anon, authenticated using (true);

create policy "Admins can insert tournament settings"
on public.tournament_settings for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update tournament settings"
on public.tournament_settings for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete tournament settings"
on public.tournament_settings for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create trigger tournament_settings_updated_at
before update on public.tournament_settings
for each row execute function public.set_updated_at();

insert into public.tournament_settings (tournament_number, name, starts_at, prize_pool)
values (25, 'Albastini Tournament #25', '2026-08-27T15:00:00+03:00', 'TSh 250,000');

-- WINNERS
create table public.winners (
  id uuid primary key default gen_random_uuid(),
  position integer not null,
  name text not null,
  image_url text,
  tournament text not null default 'Albastini Tournament',
  event_date text,
  city text,
  prize text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.winners to anon;
grant select, insert, update, delete on public.winners to authenticated;
grant all on public.winners to service_role;
alter table public.winners enable row level security;

create policy "Winners are public"
on public.winners for select to anon, authenticated using (true);

create policy "Admins can insert winners"
on public.winners for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update winners"
on public.winners for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete winners"
on public.winners for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create trigger winners_updated_at
before update on public.winners
for each row execute function public.set_updated_at();

insert into public.winners (position, name, tournament, event_date, city, prize) values
  (1, 'Winner name pending', 'Albastini Tournament', 'June 2026', 'Dar es Salaam', 'TSh 2,000,000'),
  (2, 'Winner name pending', 'Albastini Tournament', 'June 2026', 'Dar es Salaam', 'TSh 1,000,000'),
  (3, 'Winner name pending', 'Albastini Tournament', 'June 2026', 'Mwanza', 'TSh 500,000');

-- CARD SIGNUPS
create table public.card_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

grant insert on public.card_signups to anon;
grant select, insert on public.card_signups to authenticated;
grant all on public.card_signups to service_role;
alter table public.card_signups enable row level security;

create policy "Anyone can sign up for card updates"
on public.card_signups for insert to anon, authenticated
with check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' and length(email) <= 255);

create policy "Admins can read card signups"
on public.card_signups for select to authenticated
using (public.has_role(auth.uid(), 'admin'));