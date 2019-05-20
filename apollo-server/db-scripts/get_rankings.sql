with gender_split(word, str) as (
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
seriesIds_split(ids, str) as (
	select '', :seriesIds || ','
    union all
	select
		substr(str, 0, instr(str, ',')),
		substr(str, instr(str, ',')+1)
    from seriesIds_split 
	where str != ''
),
characterIds_split(ids, str) as (
	select '', :characterIds || ','
    union all
	select
		substr(str, 0, instr(str, ',')),
		substr(str, instr(str, ',')+1)
    from characterIds_split 
	where str != ''
)
select r.*, r.rowId as 'rank'
from ranking_temp as r
join series as s on r.seriesId = s.id
where
	r.name like :search and
	(:genders is null or r.gender in (select word from gender_split where word != '')) and
	(:sources is null or s.source in (select word from source_split where word != '')) and
    (:seriesIds is null or s.id in (select ids from seriesIds_split where ids != '')) and
	(:characterIds is null or r.id in (select ids from characterIds_split where ids != ''))
limit :skipNum, :takeNum;