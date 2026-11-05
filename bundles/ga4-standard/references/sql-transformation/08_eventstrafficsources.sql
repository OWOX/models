-- Operation: Events traffic sources
-- Destination table: eventstrafficsources
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Preparing eventTrafficSource object

  WITH input AS
    (
      SELECT
          PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
          PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    ) 
 
  SELECT    
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
          IFNULL(events.source, ''),
          IFNULL(events.medium, ''),
          IFNULL(events.campaign, ''),
          IFNULL(events.keyword, ''),
          IFNULL(events.adContent , '')
        )) AS STRING) AS eventTrafficSourceHash,        
    events.source,        
    events.medium,
    events.campaign,
    events.keyword,
    events.adContent
  FROM input as i, `{{project_id}}.{{dataset_id}}._temp_sessions`,
  UNNEST (events) as events
  WHERE date BETWEEN i.date_start AND i.date_end
  GROUP BY 1,2,3,4,5,6
