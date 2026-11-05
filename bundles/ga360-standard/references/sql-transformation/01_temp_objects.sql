-- Operation: Temp objects (staging)
-- Destination table: _temp_objects
-- Write mode: Overwrite (page and eventinfo read this table whole, so Append would repeat every earlier window)
-- Variables: end_suffix, source_dataset_id, source_project_id, start_suffix

#Intermediate table with data for the pageviews, page, events, eventsInfo object as well as information about transactions for deduplication
WITH   
  #Set the date range for the calculation
    dates AS 
      ( 
        SELECT
          {{start_suffix}} AS date_start,
          {{end_suffix}} AS date_end,
      ),
  #Preparing data for pageviews object
    pageview AS
      (
        SELECT  
          STRUCT ( 
            date AS date,
            sessionId AS sessionId,
            hitId,
            time AS time,
            pageviews AS pageview,
            CAST(FARM_FINGERPRINT(CONCAT(IFNULL(hostName,""),IFNULL(pagePath,""),IFNULL(pageTitle,""))) AS STRING) AS pageHash
          ) AS pageviews,
          STRUCT ( #empty
            CAST(null AS STRING) AS pageHash,
            CAST(null AS STRING) AS hostName,  
            CAST(null AS STRING) AS pagePath,  
            CAST(null AS STRING) AS pageTitle
          ) AS page,    
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS events,
            CAST(null AS STRING) AS pageHash
          ) AS events,
          STRUCT ( #empty
            CAST(null AS STRING) AS eventHash,
            CAST(null AS STRING) AS eventCategory,  
            CAST(null AS STRING) AS eventAction,  
            CAST(null AS STRING) AS eventLabel
          ) AS eventInfo,
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS STRING) AS transactionId,
            CAST(null AS FLOAT64) AS transactionRevenue
          ) AS transactions       
        FROM
          (
            SELECT
              PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS date,
              CONCAT(fullvisitorId,'_',CAST(visitId as STRING)) as sessionId,
              TO_HEX(MD5(CONCAT(fullvisitorId,'_',CAST(visitId as STRING),'_',hits.time,'_',ROW_NUMBER() OVER (partition by CONCAT(fullvisitorId,'_',CAST(visitId as STRING)) ORDER BY hits.hitNumber)))) as hitId,  
              visitStartTime*1000+hits.time AS time,
              1 AS pageviews,
              hits.page.hostName,
              hits.page.pageTitle,
              REGEXP_EXTRACT(hits.page.pagePath, r'^[^?#;]*') AS pagePath,  
              --ROW_NUMBER () OVER (PARTITION BY hitId ORDER BY hits.time asc) as RN
              #List all CDs of the hit level, also name them
              --(SELECT MAX(IF(index=1,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_1,
              --(SELECT MAX(IF(index=2,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_2,
              --(SELECT MAX(IF(index=3,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_3,
            FROM
              dates AS d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`,
            UNNEST (hits) AS hits  
            WHERE _TABLE_SUFFIX BETWEEN d.date_start AND d.date_end AND hits.type='PAGE'
          )
      ),
  #Preparing data for page object
    p AS
      (
        SELECT
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS pageview,
            CAST(null AS STRING) AS pageHash
          ) AS pageviews,
          STRUCT (
            CAST(FARM_FINGERPRINT(CONCAT(IFNULL(hostName,""),IFNULL(pagePath,""),IFNULL(pageTitle,""))) AS STRING) AS pageHash,
            hostName AS hostName,
            pagePath AS pagePath,
            pageTitle AS pageTitle
          ) AS page,  
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS events,
            CAST(null AS STRING) AS pageHash
          ) AS events,
          STRUCT ( #empty
            CAST(null AS STRING) AS eventHash,
            CAST(null AS STRING) AS eventCategory,  
            CAST(null AS STRING) AS eventAction,  
            CAST(null AS STRING) AS eventLabel
          ) AS eventInfo,
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS STRING) AS transactionId,
            CAST(null AS FLOAT64) AS transactionRevenue
          ) AS transactions  
        FROM
          (
            SELECT  
              hits.page.hostName,  
              hits.page.pageTitle,
              REGEXP_EXTRACT(hits.page.pagePath, r'^[^?#;]*') AS pagePath,           
              #List all CDs of the hit level, also name them
              --(SELECT MAX(IF(index=1,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_1,
              --(SELECT MAX(IF(index=2,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_2,
              --(SELECT MAX(IF(index=3,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_3,
            FROM
              dates AS d,`{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`, 
            UNNEST (hits) AS hits  
            WHERE _TABLE_SUFFIX BETWEEN d.date_start AND d.date_end AND hits.type='PAGE'
            GROUP BY 1,2,3
          )
      ),
  #Preparing data for events object
    event AS 
      (
        SELECT
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS pageview,
            CAST(null AS STRING) AS pageHash
          ) AS pageviews,
          STRUCT ( #empty
            CAST(null AS STRING) AS pageHash,
            CAST(null AS STRING) AS hostName,  
            CAST(null AS STRING) AS pagePath,  
            CAST(null AS STRING) AS pageTitle
          ) AS page,   
          STRUCT (   
            date,
            sessionId,
            hitId,
            time,
            events,
            eventHash
          ) AS events,
          STRUCT ( #empty
            CAST(null AS STRING) AS eventHash,
            CAST(null AS STRING) AS eventCategory,  
            CAST(null AS STRING) AS eventAction,  
            CAST(null AS STRING) AS eventLabel
          ) AS eventInfo,
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS STRING) AS transactionId,
            CAST(null AS FLOAT64) AS transactionRevenue
          ) AS transactions     
          #List all CDs of the hit level, also name them
          --(SELECT MAX(IF(index=1,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_1,
          --(SELECT MAX(IF(index=2,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_2,
          --(SELECT MAX(IF(index=3,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_3,
        FROM
          (
            SELECT            
              PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS date,
              CONCAT(fullvisitorId,'_',CAST(visitId as STRING)) as sessionId,
              TO_HEX(MD5(CONCAT(fullvisitorId,'_',CAST(visitId as STRING),'_',hits.time,'_',ROW_NUMBER() OVER (partition by CONCAT(fullvisitorId,'_',CAST(visitId as STRING)) ORDER BY hits.hitNumber)))) as hitId,  
              visitStartTime*1000+hits.time AS time,
              1 as events,
              CAST(FARM_FINGERPRINT(CONCAT(IFNULL(hits.eventInfo.eventCategory,""),IFNULL(hits.eventInfo.eventAction,""),IFNULL(hits.eventInfo.eventLabel,""))) AS STRING) AS eventHash, 
              --ROW_NUMBER () OVER (PARTITION BY hitId ORDER BY hits.time ASC) as RN
            FROM
            dates as d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`, 
            UNNEST (hits) AS hits  
            WHERE _TABLE_SUFFIX BETWEEN d.date_start AND d.date_end AND hits.type='EVENT'    
          )
      ),
  #Preparing data for eventInfo object
    ei AS 
      (
        SELECT
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS pageview,
            CAST(null AS STRING) AS pageHash
          ) AS pageviews,
          STRUCT ( #empty
            CAST(null AS STRING) AS pageHash,
            CAST(null AS STRING) AS hostName,  
            CAST(null AS STRING) AS pagePath,  
            CAST(null AS STRING) AS pageTitle
          ) AS page,     
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS events,
            CAST(null AS STRING) AS pageHash
          ) AS events,
          STRUCT (  
            eventHash,    
            eventCategory,
            eventAction,
            eventLabel
          ) AS eventInfo,
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS STRING) AS transactionId,
            CAST(null AS FLOAT64) AS transactionRevenue
          ) AS transactions  
        FROM  
          (
            SELECT  
              CAST(FARM_FINGERPRINT(CONCAT(IFNULL(hits.eventInfo.eventCategory,""),IFNULL(hits.eventInfo.eventAction,""),IFNULL(hits.eventInfo.eventLabel,""))) AS STRING) AS eventHash,    
              hits.eventInfo.eventCategory AS eventCategory,
              hits.eventInfo.eventAction AS eventAction,
              hits.eventInfo.eventLabel AS eventLabel
              #List all CDs of the hit level, also name them
              --(SELECT MAX(IF(index=1,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_1,
              --(SELECT MAX(IF(index=2,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_2,
              --(SELECT MAX(IF(index=3,value,NULL)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_3,
            FROM
              dates as d,`{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`, 
            UNNEST (hits) AS hits  
            WHERE _TABLE_SUFFIX BETWEEN d.date_start AND d.date_end AND hits.type='EVENT'
            GROUP BY 1,2,3,4
          )
      ),
  #Preparing data for transactions object
    transaction AS 
      (
        SELECT  
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS pageview,
            CAST(null AS STRING) AS pageHash
          ) AS pageviews,
          STRUCT ( #empty
            CAST(null AS STRING) AS pageHash,
            CAST(null AS STRING) AS hostName,  
            CAST(null AS STRING) AS pagePath,  
            CAST(null AS STRING) AS pageTitle
          ) AS page,     
          STRUCT ( #empty
            CAST(null AS DATE) AS date,
            CAST(null AS STRING) AS sessionId,
            CAST(null AS STRING) AS hitId,
            CAST(null AS INTEGER) AS time,
            CAST(null AS INTEGER) AS events,
            CAST(null AS STRING) AS pageHash
          ) AS events,
          STRUCT ( #empty
            CAST(null AS STRING) AS eventHash,
            CAST(null AS STRING) AS eventCategory,  
            CAST(null AS STRING) AS eventAction,  
            CAST(null AS STRING) AS eventLabel
          ) AS eventInfo,
          STRUCT ( 
            date,
            sessionId,
            time,
            transactionId,
            transactionRevenue 
          ) AS transactions
        FROM
          (     
            SELECT    
               PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS date,
               CONCAT(fullvisitorId,'_',CAST(visitId as STRING)) as sessionId,
               visitStartTime*1000+hits.time AS time,                    
               hits.transaction.transactionId AS transactionId,
               hits.transaction.transactionRevenue AS transactionRevenue                  
            FROM
               dates as d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*`,
            UNNEST (hits) AS hits  
            WHERE _TABLE_SUFFIX BETWEEN d.date_start AND d.date_end AND hits.transaction.transactionId IS NOT null 
            GROUP BY 1,2,3,4,5
          )   
      ),
  #Combining data for pageviews, page, events, eventInfo, transactions objects
    Final as 
      (
        SELECT pageviews.date as date, * FROM pageview
        UNION ALL
        SELECT CAST(null as DATE) as date, * FROM p
        UNION ALL
        SELECT events.date as date, * FROM event
        UNION ALL
        SELECT CAST(null as DATE) as date, * FROM ei
        UNION ALL
        SELECT transactions.date as date, * FROM transaction 
      )      

SELECT 
  *
FROM 
  Final
