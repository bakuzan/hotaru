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
),
ratio_cte as (
	select
	m_cte.id as characterId,
	m_cte.name,
	m_cte.total,
	w_cte.wins,
	cast(w_cte.wins as float) / cast(m_cte.total as float) as ratio
	from m_cte
	left join w_cte
	on m_cte.id = w_cte.id
),
avg_cte as (
	select avg(r.ratio) as avgRatio
	from ratio_cte as r
)
select 
	*,
	((r.wins + 10 * (select avgRatio from avg_cte)) / (r.total + 10)) as rankOrder
from ratio_cte as r
order by rankOrder desc, r.wins desc, r.total asc, r.name asc;
