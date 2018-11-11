select
    c.id,
    c.name,
    c.displayImage,
    count(v.winnerId) as 'played',
    sum(case when v.winnerId = c.id then 1 else 0 end) as 'won',
    sum(case when v.winnerId <> c.id then 1 else 0 end) as 'lost'
from characters as c
	join HTRInstanceCharacter as ic on c.id = ic.characterId
    left join VersusCharacter as vc on c.id = vc.characterId
	left join versus as v on vc.versusId = v.id and ic.htrInstanceId = v.htrInstanceId
where 
	ic.htrInstanceId = :leagueId
group by c.id
order by won desc, played asc, name asc