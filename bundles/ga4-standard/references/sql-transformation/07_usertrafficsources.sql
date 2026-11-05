-- Operation: User traffic sources
-- Destination table: usertrafficsources
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Preparing UserTrafficSource object

  WITH input AS
    (
      SELECT
          PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
          PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    ) 
 
  SELECT    
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
          IFNULL(user_source, ''),
          IFNULL(user_medium, ''),
          IFNULL(user_campaign, '')
        )) AS STRING) AS trafficSourceHash,        
    user_source,        
    user_medium,
    user_campaign
  FROM input as i, `{{project_id}}.{{dataset_id}}._temp_sessions`
  WHERE date BETWEEN i.date_start AND i.date_end
  GROUP BY 1,2,3,4
