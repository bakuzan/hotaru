const initalSqlForRankingJob = `
select 
	t1.id as characterId, 
	t1.name, 
	t1.matches as total, 
	t2.wins, 
	(select count(*) from characters ch where ch.id >= t2.id) as rank
from 
(select c.id, c.name, count(vc.characterId) as matches
	from characters as c
	left join VersusCharacter as vc on c.id = vc.characterId
	group by c.id) t1
left join 
(select  c.id, c.name, count(v.winnerId) as wins
	from characters as c
	left join versus as v on c.id = v.winnerId
	group by c.id) t2
on t1.id = t2.id
order by t2.wins desc, t1.matches asc
`;

const rewriteAsAView = `
drop view ranking;

create view ranking as
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
  m_cte.id,
  m_cte.name,
  m_cte.total,
  w_cte.wins,
  (select count(*) from w_cte as w where w.wins >= w_cte.wins) as rank
from m_cte
left join w_cte
on m_cte.id = w_cte.id
order by w_cte.wins desc, m_cte.total asc
`;
