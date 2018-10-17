select c.*
from characters c
    left join VersusCharacter vc on c.id = vc.characterId
where vc.versusId is null
order by RANDOM()
limit 2
