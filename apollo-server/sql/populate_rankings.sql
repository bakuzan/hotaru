drop view if exists ranking;
drop table if exists ranking_temp;

create temporary table ranking_temp as
with 
m_cte as (
	select c.id, c.name, count(vc.characterId) as total
	from characters as c
	left join VersusCharacter as vc on c.id = vc.characterId
	group by c.id
),
w_cte as (
	select c.id, c.name, count(v.winnerId) as wins
	from characters as c
	left join versus as v on c.id = v.winnerId
	group by c.id
)
select
  m_cte.id as characterId,
  m_cte.name,
  m_cte.total,
  w_cte.wins
from m_cte
left join w_cte
on m_cte.id = w_cte.id
order by w_cte.wins desc, m_cte.total asc;

create view ranking as
select
	r.rowid as rank,
	r.characterId,
	r.name,
	r.total,
	r.wins
from ranking_temp as r
order by rank