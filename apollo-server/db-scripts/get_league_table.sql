select
    c.id,
    c.name,
    c.displayImage,
    count(v.winnerId) as 'played',
    sum(case when v.winnerId = c.id then 1 else 0 end) as 'won',
    sum(case when v.winnerId <> c.id then 1 else 0 end) as 'lost'
from versus as v
    join VersusCharacter as vc on v.id = vc.versusId
    join characters as c on vc.characterId = c.id
where v.htrInstanceId = :leagueId
group by vc.characterId
order by won desc, played asc, name asc