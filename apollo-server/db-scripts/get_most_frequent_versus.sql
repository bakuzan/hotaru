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
), rival_cte as (
	select 
		count(*) as fights,
		count(case when winnerId = cId1 then 1 else null end) as c1Wins,
		count(case when winnerId = cId2 then 1 else null end) as c2Wins,
		cast(count(case when winnerId = cId1 then 1 else null end) as float) / cast(count(*) as float) as ratio,
		v2.*
	from v_cte as v2
	group by cId1, cId2
	having count(*) > 1
), by_fights as (
	select *
	from rival_cte
	order by fights desc, updatedAt desc
	limit 1
), by_ratio as (
	select *
	from rival_cte
	where ratio <> 1 and ratio <> 0
	order by abs(ratio - 0.5), fights desc, updatedAt desc
	limit 1
)
select * from by_fights
union all
select * from by_ratio