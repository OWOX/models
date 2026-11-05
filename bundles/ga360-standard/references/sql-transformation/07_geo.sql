-- Operation: Geo
-- Destination table: geo
-- Write mode: Append
-- Variables: end_suffix, source_dataset_id, source_project_id, start_suffix

#Geo object
WITH 
  #Set the date range for the calculation
    dates as 
      ( 
        SELECT
          {{start_suffix}} AS date_start,
          {{end_suffix}} AS date_end,
      )

SELECT
  CAST(FARM_FINGERPRINT(CONCAT(
    IFNULL(geoNetwork.country,""),
    IFNULL(geoNetwork.region,""),
    IFNULL(geoNetwork.city,""))) as STRING) as geoHash,
  geoNetwork.country,
  geoNetwork.region,
  geoNetwork.city
FROM
  dates as d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*` 
WHERE 
  _TABLE_SUFFIX BETWEEN d.date_start and d.date_end
GROUP BY 1,2,3,4
