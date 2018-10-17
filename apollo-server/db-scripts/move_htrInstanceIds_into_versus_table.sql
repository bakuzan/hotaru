update versus set htrInstanceId = 
(select htrInstanceId
from HTRInstanceVersus
where versusId = versus.id)