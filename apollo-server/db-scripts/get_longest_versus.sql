select
	v.*,
	vc1.characterId as cId1,
	vc2.characterId as cId2,
	cast((julianday(v.updatedAt) - julianday(v.createdAt)) * 24 * 60 * 60 as integer) as diff
from
	versus as v
join VersusCharacter as vc1 on v.id = vc1.versusId
join VersusCharacter as vc2 on v.id = vc2.versusId and vc1.characterId <> vc2.characterId
where
	v.winnerId not null 
order by diff desc
limit 1