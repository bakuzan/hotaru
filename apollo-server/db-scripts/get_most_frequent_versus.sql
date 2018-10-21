with v_cte as (
	select
		vc1.versusId,
		vc1.characterId as cId1,
		vc2.characterId as cId2,
		v.updatedAt,
		v.winnerId
	from VersusCharacter as vc1
	join versus as v on vc1.versusId = v.id
	join VersusCharacter as vc2 on vc1.versusId = vc2.versusId
	where
		vc1.characterId <> vc2.characterId
	group by vc1.versusId
)
select 
	count(*) as count,
	count(case when winnerId = cId1 then 1 else null end) as c1Wins,
	count(case when winnerId = cId2 then 1 else null end) as c2Wins,
	count(case when winnerId = cId1 then 1 else null end) / count(*) as ratio,
	cId1,
	cId2
from v_cte
group by cId1, cId2
having count(*) > 1
order by count(*) desc, updatedAt desc