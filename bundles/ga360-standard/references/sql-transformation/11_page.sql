-- Operation: Page
-- Destination table: page
-- Write mode: Append
-- Variables: dataset_id, project_id

#Page object

SELECT 
  page.* 
FROM `{{project_id}}.{{dataset_id}}._temp_objects`
WHERE page.pageHash IS NOT null 
GROUP BY 1,2,3,4
