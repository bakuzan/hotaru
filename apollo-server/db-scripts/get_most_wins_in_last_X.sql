select 
	c.id,
	c.name,
	c.displayImage,
	count(*) as count
from versus as v
join characters as c on v.winnerId = c.id
where
	v.winnerId is not null and
	v.updatedAt > :daysAgo
group by v.winnerId
order by count desc, v.updatedAt asc
limit 1