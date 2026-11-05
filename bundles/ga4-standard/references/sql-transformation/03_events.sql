-- Operation: Events
-- Destination table: events
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Preparing events object
  WITH input AS
    (
      SELECT
          PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
          PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    ) 
  SELECT
    date, 
    pseudo_session_id, 
    TO_HEX(MD5(CONCAT(user_pseudo_id,'_',events.timestamp,'_',ROW_NUMBER() OVER (PARTITION BY user_pseudo_id ORDER BY events.timestamp, events.event_name)))) AS hitId,
    events.timestamp AS time,
    1 as events,
    event_name,
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
          IFNULL(events.source, ''),
          IFNULL(events.medium, ''),
          IFNULL(events.campaign, ''),
          IFNULL(events.keyword, ''),
          IFNULL(events.adContent , '')
        )) AS STRING) AS eventTrafficSourceHash
  FROM input as i, `{{project_id}}.{{dataset_id}}._temp_sessions`,
  UNNEST (events) as events
  WHERE date BETWEEN i.date_start AND i.date_end AND event_name!='page_view'
