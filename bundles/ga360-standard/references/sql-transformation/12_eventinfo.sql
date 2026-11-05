-- Operation: EventInfo
-- Destination table: eventinfo
-- Write mode: Append
-- Variables: dataset_id, project_id

#EventInfo object

SELECT 
  eventInfo.* 
FROM `{{project_id}}.{{dataset_id}}._temp_objects`
WHERE eventInfo.eventHash IS NOT null 
GROUP BY 1,2,3,4
