-- Operation: Traffic sources
-- Destination table: trafficsources
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Preparing TrafficSource object

  WITH input AS
    (
      SELECT
          PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
          PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    ) 
 
  SELECT    
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
          IFNULL(session_source, ''),
          IFNULL(session_medium, ''),
          IFNULL(session_campaign, ''),
          IFNULL(session_keyword, ''),
          IFNULL(session_adContent , '')
        )) AS STRING) AS trafficSourceHash,        
    session_source as source,        
    session_medium as medium,
    session_campaign as campaign,
    session_keyword as keyword,
    session_adContent as adContent
  FROM input as i, `{{project_id}}.{{dataset_id}}._temp_sessions`
  WHERE date BETWEEN i.date_start AND i.date_end
  GROUP BY 1,2,3,4,5,6
