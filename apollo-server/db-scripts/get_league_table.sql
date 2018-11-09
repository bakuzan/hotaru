select
    c.id,
    c.name,
    c.displayImage,
    count(v.winnerId) as 'played',
    sum(case when v.winnerId = c.id then 1 else 0 end) as 'won',
    sum(case when v.winnerId <> c.id then 1 else 0 end) as 'lost'
from characters as c
	join HTRInstanceCharacter as ic on c.id = ic.characterId
	left join versus as v on ic.htrInstanceId = v.htrInstanceId
    left join VersusCharacter as vc on v.id = vc.versusId and c.id = vc.characterId
where 
	ic.htrInstanceId = :leagueId
group by c.id
order by won desc, played asc, name asc