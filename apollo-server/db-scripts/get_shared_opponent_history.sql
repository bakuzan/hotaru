with
    c1_cte
    as
    (
        select versusId as id
        from VersusCharacter
        where characterId = :c1
    ),
    c2_cte
    as
    (
        select versusId as id
        from VersusCharacter
        where characterId = :c2
    ),
    v1_cte
    as
    (
        select
            v.*,
            vc.characterId
        from versus as v
            join c1_cte as c1 on v.id = c1.id
            join VersusCharacter as vc on v.id = vc.versusId
        where vc.characterId <> :c1
    ),
    v2_cte
    as
    (
        select
            v.*,
            vc.characterId
        from versus as v
            join c2_cte as c2 on v.id = c2.id
            join VersusCharacter as vc on v.id = vc.versusId
        where vc.characterId <> :c2
    )
select *
from v1_cte as v1
    left join v2_cte as v2 on v1.characterId = v2.characterId
where v2.id
not null