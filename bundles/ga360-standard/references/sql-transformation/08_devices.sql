-- Operation: Devices
-- Destination table: devices
-- Write mode: Append
-- Variables: end_suffix, source_dataset_id, source_project_id, start_suffix

#Devices object
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
    IFNULL(device.deviceCategory,""),
    IFNULL(device.browser,""),
    IFNULL(device.browserVersion,""),
    IFNULL(device.operatingSystem,""),
    IFNULL(device.operatingSystemVersion,"")))  as STRING) as deviceHash,
  device.deviceCategory,
  device.browser,
  device.browserVersion,
  device.operatingSystem,
  device.operatingSystemVersion
FROM
  dates as d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`
WHERE 
  _TABLE_SUFFIX BETWEEN d.date_start and d.date_end
GROUP BY 1,2,3,4,5,6
