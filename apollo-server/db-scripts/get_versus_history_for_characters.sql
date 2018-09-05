with c1_cte as (
	select versusId as id
	from VersusCharacter
	where characterId = :c1
),
c2_cte as (
	select versusId as id
	from VersusCharacter
	where characterId = :c2
)
select
	v.id,
	v.type,
	v.winnerId,
	v.updatedAt
from versus as v
join c1_cte as c1 on v.id = c1.id
join c2_cte as c2 on v.id = c2.id