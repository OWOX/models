-- Operation: Users
-- Destination table: users
-- Write mode: Append
-- Variables: end_suffix, source_dataset_id, source_project_id, start_suffix

#Users object

WITH 
  #Set the date range for the calculation
    dates as 
      (
        SELECT
          {{start_suffix}} AS date_start,
          {{end_suffix}} AS date_end
      ),

  #Select user data from streaming
    web_users as 
      (      
        SELECT
          clientId,
          CAST(null as STRING) as userId,
          CAST(null as STRING) as visitorId,
          CAST(null as STRING) as userPseudoId,
          CAST(null as STRING) as phone,
          CAST(null as STRING) as email,
        FROM
          dates as d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`
        WHERE 
          _TABLE_SUFFIX BETWEEN d.date_start and d.date_end          
        GROUP BY 1,2,3,4,5,6  
      )

SELECT
  CAST(FARM_FINGERPRINT(CONCAT(
    IFNULL(clientId,""),
    IFNULL(userId,""),  
    IFNULL(visitorId,""),    
    IFNULL(userPseudoId,""),    
    IFNULL(phone,""),    
    IFNULL(email,"")    
     )) as STRING) as userHash,
  clientId,
  userId,
  visitorId,
  userPseudoId,
  phone,
  email
FROM web_users
GROUP BY 1,2,3,4,5,6,7
