select r.*, r.rowId as 'rank'
from ranking_temp as r
join series as s on r.seriesId = s.id
where
	r.name like :search and
	(:genders is null or r.gender in (:genders)) and
	(:sources is null or s.source in (:sources)) and
    (:seriesIds is null or s.id in (:seriesIds)) and
	(:characterIds is null or r.id in (:characterIds))
limit :skipNum, :takeNum;