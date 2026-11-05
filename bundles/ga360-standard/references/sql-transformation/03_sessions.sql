-- Operation: Sessions
-- Destination table: sessions
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, source_dataset_id, source_project_id, start_suffix, tdw

#Sessions object

WITH
  #Set the date range for the calculation
    dates AS
      (
        SELECT
          {{start_suffix}} AS date_start,
          {{end_suffix}} AS date_end, 
          {{tdw}} AS tdw #Number of days for deduplicating transactions, for cases where the same transaction could be repeated during few days
      ),
 
  #Transaction deduplication block
    transaction_deduplication AS --deduplicating transactions with the revenue for days and sessions
      (
        SELECT
          t.date,
          t.sessionId,
          COUNT(*) AS transactions,
          SUM(t.transactionRevenue) AS transactionRevenue,
        FROM 
          (--selected transactions for the specified period + a lookback window (tdw) for transaction deduplication
            SELECT
              t.date,
              t.sessionId,
              t.transactionId,
              t.transactionRevenue,
              ROW_NUMBER() OVER (PARTITION BY t.transactionId ORDER BY time ASC) AS RN
            FROM
              dates AS d, `{{project_id}}.{{dataset_id}}._temp_transactions` AS t
            WHERE
              t.date BETWEEN DATE_SUB(PARSE_DATE('%Y%m%d', d.date_start), INTERVAL tdw DAY) AND PARSE_DATE('%Y%m%d', d.date_end)
          ) AS t, dates AS d
        WHERE
          RN=1
          AND
          t.date BETWEEN PARSE_DATE('%Y%m%d', d.date_start) AND PARSE_DATE('%Y%m%d', d.date_end)
        GROUP BY 1,2
      ),
  #Session data selection block
    sessions_data AS
      (
        SELECT
          #main attributes of the Sessions object
            PARSE_DATE('%Y%m%d',_TABLE_SUFFIX) AS date,
            CONCAT(fullvisitorId,'_',CAST(visitId as STRING)) as sessionId,
            #landingPage и landingHost are taken from the first hit with isEntrance=1, or from the first hit in session, if there is no hits with isEntrance=1 (in case the session starts with event)
            #from the landingPage is the part of the link before the first occurrence taken ? or # or ;
            REGEXP_EXTRACT((SELECT * EXCEPT(RN) FROM (SELECT h.page.pagePath, ROW_NUMBER() OVER(ORDER BY IF(h.isEntrance=true, 1, 2) ASC, time ASC) AS RN FROM UNNEST(s.hits) AS h) WHERE RN=1), r'^[^?#;]*') AS landingPage,
            (SELECT * EXCEPT(RN) FROM (SELECT h.page.hostname, ROW_NUMBER() OVER(ORDER BY IF(h.isEntrance=true, 1, 2) ASC, time ASC) AS RN FROM UNNEST(s.hits) AS h) WHERE RN=1) AS landingHost,
            visitStartTime,
            visitNumber,
            'WEB' AS touchpoint,
            '{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*' AS dataSource,
            totals.hits AS hits,
            (SELECT SUM(IF(h.type='PAGE', 1, 0)) FROM UNNEST(s.hits) AS h) AS pageviews,
            (SELECT SUM(IF(h.type='EVENT', 1, 0)) FROM UNNEST(s.hits) AS h) AS events,
            IF((SELECT SUM(IF(h.type='PAGE' OR (h.type='EVENT' AND h.isInteraction=true), 1, 0)) FROM UNNEST(s.hits) AS h)<=1, 1, 0) AS bounces,
            DIV((SELECT MAX(h.time)-MIN(h.time) FROM UNNEST(hits) AS h), 1000) AS timeOnSite, --duration in seconds
          #keys to connect to other model objects
            CAST(FARM_FINGERPRINT(CONCAT( --userHash
                IFNULL(clientId, ''),
                IFNULL(CAST(null as STRING),""),  
                IFNULL(CAST(null as STRING),""),    
                IFNULL(CAST(null as STRING),""),    
                IFNULL(CAST(null as STRING),""),    
                IFNULL(CAST(null as STRING),"")   
              )) AS STRING) AS userHash,
            CAST(FARM_FINGERPRINT(CONCAT( --geoHash
                IFNULL(geoNetwork.country, ''),
                IFNULL(geoNetwork.region, ''),
                IFNULL(geoNetwork.city, '')
              )) AS STRING) AS geoHash,
            CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
                IFNULL(device.deviceCategory, ''),
                IFNULL(device.browser, ''),
                IFNULL(device.browserVersion, ''),
                IFNULL(device.operatingSystem, ''),
                IFNULL(device.operatingSystemVersion, '')
              )) AS STRING) AS deviceHash,
            CAST(FARM_FINGERPRINT(CONCAT( --trafficSourceHash
                IFNULL(trafficSource.source, ''),
                IFNULL(trafficSource.medium, ''),
                IFNULL(trafficSource.campaign, ''),
                IFNULL(trafficSource.keyword, ''),
                IFNULL(trafficSource.adContent, '')
              )) AS STRING) AS trafficSourceHash,
          #List all session-level CDs, also name them
            --(SELECT MAX(IF(index=1, value, null)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_1,
            --(SELECT MAX(IF(index=2, value, null)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_2,
            --(SELECT MAX(IF(index=3, value, null)) FROM UNNEST(hits.customDimensions)) AS custom_dimension_3,
        FROM
          dates AS d, `{{source_project_id}}.{{source_dataset_id}}.ga_sessions_*` AS s
        WHERE
          _TABLE_SUFFIX BETWEEN d.date_start and d.date_end
      )

SELECT
  s.*,
  IFNULL(t.transactions,0) as transactions,
  IFNULL(t.transactionRevenue,0) as transactionRevenue,
  0 as impressions,
  0 as clicks,
  0.0 as cost
FROM
  sessions_data AS s
  LEFT JOIN
  transaction_deduplication AS t
  ON s.sessionId=t.sessionId AND s.date=t.date
