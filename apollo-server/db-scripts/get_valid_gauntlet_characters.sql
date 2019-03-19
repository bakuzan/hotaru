with 
vc_cte as (
    select 
		c.id, 
		c.name,
		count(vc.characterId) as versusCount
    from characters as c
    join VersusCharacter as vc on c.id = vc.characterId
    group by c.id
),
max_cte as (
  select versusCount
  from vc_cte
  order by versusCount desc, name asc
  limit 1
),
min_cte as (
  select versusCount
  from vc_cte
  order by versusCount asc, name asc
  limit 1
),
cut_cte as (
  select versusCount 
  from vc_cte 
  order by versusCount asc, name asc
  limit 50, 1
)
select 
    c.id,
    c.name,
    c.displayImage,
    count(vc.versusId) as versusCount
from characters as c
join series as s on c.seriesId = s.id
left outer join VersusCharacter as vc on c.id = vc.characterId
group by c.id
having 
    (:characterId is null
    and
    versusCount < (select versusCount from cut_cte)
    and
    c.name like '%:search%'
    and
    s.source in (:sources)
    and
	c.gender in (:genders))
    or
    c.id = :characterId
order by versusCount asc, c.name asc
limit :limit
offset :offset