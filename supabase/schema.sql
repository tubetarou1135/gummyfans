-- グミテーブル
create table gummies (
  id bigint primary key generated always as identity,
  name text not null,
  maker text not null,
  flavor text,
  description text,
  image_url text,
  created_at timestamptz not null default now()
);

-- レビューテーブル
create table reviews (
  id bigint primary key generated always as identity,
  gummy_id bigint not null references gummies(id) on delete cascade,
  nickname text not null,
  comment text,
  hardness int not null check (hardness between 1 and 5),
  sweetness int not null check (sweetness between 1 and 5),
  sourness int not null check (sourness between 1 and 5),
  value int not null check (value between 1 and 5),
  overall int not null check (overall between 1 and 5),
  created_at timestamptz not null default now()
);

-- 平均評価ビュー
create view gummies_with_avg as
select
  g.*,
  round(avg(r.overall)::numeric, 1) as avg_overall,
  count(r.id) as review_count
from gummies g
left join reviews r on r.gummy_id = g.id
group by g.id;
