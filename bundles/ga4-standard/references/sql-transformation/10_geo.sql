-- Operation: Geo
-- Destination table: geo
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Object Geo preparation

WITH
  input AS
    (
      SELECT
        PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
        PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    )

SELECT
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
          IFNULL(country, ''),
          IFNULL(region, ''),
          IFNULL(city, '')                  
        )) AS STRING) AS geoHash,
    country,
    region,
    city
FROM
  input AS i, `{{project_id}}.{{dataset_id}}._temp_sessions`
WHERE
  date BETWEEN i.date_start AND i.date_end         
GROUP BY 1,2,3,4
