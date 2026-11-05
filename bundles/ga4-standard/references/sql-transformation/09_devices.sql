-- Operation: Devices
-- Destination table: devices
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Preparing Devices object

WITH
  input AS
    (
      SELECT
        PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
        PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    )

SELECT
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
          IFNULL(deviceCategory, ''),
          IFNULL(operatingSystem, ''),
          IFNULL(operatingSystemInfo, ''),
          IFNULL(browser, ''),
          IFNULL(browserVersion , '')
        )) AS STRING) AS deviceHash,
    deviceCategory,
    operatingSystem,
    operatingSystemInfo,
    browser,
    browserVersion 
FROM
  input AS i, `{{project_id}}.{{dataset_id}}._temp_sessions`
WHERE
  date BETWEEN i.date_start AND i.date_end
GROUP BY 1,2,3,4,5,6
