-- Operation: Users
-- Destination table: users
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Object Users preparation

WITH
  input AS
    (
      SELECT
        PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
        PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    )

SELECT
  CAST(FARM_FINGERPRINT(CONCAT(
    IFNULL(CAST(null as STRING),""),
    IFNULL(CAST(null as STRING),""),  
    IFNULL(CAST(null as STRING),""),    
    IFNULL(user_pseudo_id,""),    
    IFNULL(CAST(null as STRING),""),    
    IFNULL(CAST(null as STRING),"")    
     )) as STRING) as userHash,
  CAST(null as STRING) as clientId,
  CAST(null as STRING) as userId,
  CAST(null as STRING) as visitorId,
  user_pseudo_id as userPseudoId,
  CAST(null as STRING) as phone,
  CAST(null as STRING) as email
FROM
  input AS i, `{{project_id}}.{{dataset_id}}._temp_sessions`
WHERE
  date BETWEEN i.date_start AND i.date_end
GROUP BY 1,2,3,4,5,6,7
