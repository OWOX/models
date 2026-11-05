-- Operation: Events
-- Destination table: events
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Events object
WITH 
  #Set the date range for the calculation
    dates as 
      ( 
        SELECT
          {{start_suffix}} AS date_start,
          {{end_suffix}} AS date_end,  
      )

SELECT 
  events.* 
FROM dates as d, `{{project_id}}.{{dataset_id}}._temp_objects` 
WHERE 
  date BETWEEN PARSE_DATE('%Y%m%d', d.date_start) AND PARSE_DATE('%Y%m%d', d.date_end) 
  AND events.date IS NOT null
