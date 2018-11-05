select
	o.versusId,
	o.characterId as c1,
	t.characterId as c2
from VersusCharacter as o
join VersusCharacter as t on o.versusId = t.versusId
where 
	o.characterId <> t.characterId
	and
	o.characterId = :c1