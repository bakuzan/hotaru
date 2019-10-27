select count(day.characterId) as total, day.characterId, ch.name
from characterOfTheDays as day
join characters as ch on day.characterId = ch.id
group by day.characterId
order by total desc