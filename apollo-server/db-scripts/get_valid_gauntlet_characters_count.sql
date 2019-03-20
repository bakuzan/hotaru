with 
gender_split(word, str) as (
	select '', :genders || ','
    union all
	select
		substr(str, 0, instr(str, ',')),
		substr(str, instr(str, ',')+1)
    from gender_split 
	where str != ''
),
source_split(word, str) as (
	select '', :sources || ','
    union all
	select
		substr(str, 0, instr(str, ',')),
		substr(str, instr(str, ',')+1)
    from source_split 
	where str != ''
), 
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
cut_cte as (
  select versusCount 
  from vc_cte 
  order by versusCount asc, name asc
  limit 50, 1
),
fq_cte as (
	select 
    c.id,
		count(vc.versusId) as versusCount
	from characters as c
	join series as s on c.seriesId = s.id
	left outer join VersusCharacter as vc on c.id = vc.characterId
	group by c.id
	having 
    (:characterId is null or c.id = :characterId)
    and
    versusCount < (select versusCount from cut_cte) and versusCount + 2 <= (select versusCount from max_cte)
    and
    c.name like :search
    and
    (:sources is null or s.source in (select word from source_split where word != ''))
    and
	  (:genders is null or c.gender in (select word from gender_split where word != ''))
	order by versusCount asc, c.name asc
)
select count(fq.id) as total
from fq_cte as fq