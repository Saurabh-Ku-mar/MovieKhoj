create table movies(id uuid primary key default gen_random_uuid(),title text not null,original_title text,
slug text unique not null,release_year int,overview text,language text,genres text[] default '{}',
poster_path text,trailer_url text,featured bool default false,published bool default false,
created_at timestamptz default now(),updated_at timestamptz default now());
create table external_links(id uuid primary key default gen_random_uuid(),
movie_id uuid not null references movies(id) on delete cascade,provider_name text not null,
destination_url text not null check (destination_url like 'https://%'),
authorized_status text default 'unverified',approved bool default false,active bool default true,created_at timestamptz default now());
create table watch_clicks(id bigserial primary key,movie_id uuid references movies(id) on delete cascade,provider_name text,clicked_at timestamptz default now());
create index on movies(published,release_year);create index on external_links(movie_id);
alter table movies enable row level security;alter table external_links enable row level security;alter table watch_clicks enable row level security;
-- public may read only published movies; no public policy on external_links/watch_clicks (server uses service role)
create policy "public read published" on movies for select using (published);
-- all writes happen server-side with the service-role key; no public write policies exist.
