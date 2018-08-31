insert into rankings
select
	null as id,
	r.total,
	r.wins,
	r.rowid as rank,
	current_timestamp as createdAt,
	current_timestamp as updatedAt,
	r.characterId
from ranking_temp as r
order by rank;
