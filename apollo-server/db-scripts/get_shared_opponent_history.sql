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
        where vc.characterId not in (:c1,:c2)
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
        where vc.characterId not in (:c1,:c2)
    ),
    shared_cte
    as
    (
        select v1.characterId as 'characterId'
        from v1_cte as v1
            join v2_cte as v2 on v1.characterId = v2.characterId
    )
select
    :c1
as 'keyCharacterId',
        v1.*,
        c.name as 'name',
        c.displayImage as 'displayImage'
    from v1_cte as v1
        join shared_cte as s on v1.characterId = s.characterId
        join characters as c on v1.characterId = c.id
union
select
    :c2
as 'keyCharacterId',
        v2.*,
        c.name as 'name',
        c.displayImage as 'displayImage'
    from v2_cte as v2
        join shared_cte as s on v2.characterId = s.characterId
        join characters as c on v2.characterId = c.id;