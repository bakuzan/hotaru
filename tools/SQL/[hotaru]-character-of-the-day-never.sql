select c.id, c.name
from characters as c
left join characterOfTheDays as day on c.id = day.characterId
where day.id IS NULL