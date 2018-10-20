with
	last_seven
	as
	(
		select
			c.id,
			c.name,
			c.displayImage,
			count(*) as count
		from versus as v
			join characters as c on v.winnerId = c.id
		where
	v.winnerId is not null and
			v.updatedAt > :daysAgo1
		group by v.winnerId
		order by count desc, v.updatedAt desc
limit 1
),
last_thirty
	 as
(
select
	c.id,
	c.name,
	c.displayImage,
	count(*) as count
from versus as v
	join characters as c on v.winnerId = c.id
where
	v.winnerId is not null and
	v.updatedAt > :daysAgo2
group by v.winnerId
order by count desc, v.updatedAt desc
limit 1
)
select *
from last_seven
union
select *
from last_thirty