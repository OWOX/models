-- Operation: Temp sessions (staging)
-- Destination table: _temp_sessions
-- Write mode: Append
-- Variables: end_suffix, session_time, source_dataset_id, source_project_id, start_suffix

#Sessionization of GA4 data

WITH
  input AS
    (
      SELECT
        {{start_suffix}} AS date_start,
        {{end_suffix}} AS date_end,
        {{session_time}} as session_time,       
    ),

  events AS
    (
      SELECT
        --parameters
          PARSE_DATE('%Y%m%d', _TABLE_SUFFIX) AS date,
          e.event_timestamp AS timestamp,
          '{{source_project_id}}.{{source_dataset_id}}.events_' as dataSource,
          e.user_pseudo_id,
          e.user_id,
          e.event_name,   
          (SELECT IF(STRPOS(value.string_value,'?')>0,SUBSTR(value.string_value,1,STRPOS(value.string_value,'?')-1),value.string_value) FROM UNNEST (event_params) WHERE key = 'page_location') as fullPath,       
          (SELECT MAX(IF(ep.key='ga_session_id', ep.value.int_value, null)) FROM UNNEST(e.event_params) AS ep) AS ga_session_id,
          FIRST_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'source' ) IGNORE nulls) OVER (PARTITION BY user_pseudo_id, (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') ORDER BY event_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS session_source,
          FIRST_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'medium' ) IGNORE nulls) OVER (PARTITION BY user_pseudo_id, (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') ORDER BY event_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS session_medium,
          FIRST_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'campaign' ) IGNORE nulls) OVER (PARTITION BY user_pseudo_id, (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') ORDER BY event_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS session_campaign,
          FIRST_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'term' ) IGNORE nulls) OVER (PARTITION BY user_pseudo_id, (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') ORDER BY event_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS session_keyword,
          FIRST_VALUE((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'content' ) IGNORE nulls) OVER (PARTITION BY user_pseudo_id, (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') ORDER BY event_timestamp ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) AS session_adcontent,
          (SELECT MAX(IF(ep.key='ga_session_number', value.int_value, null)) FROM UNNEST (e.event_params) AS ep) as visitNumber, 
          IF(event_name='session_start',CONCAT(user_pseudo_id,'_',event_timestamp),null) AS session_start_id,
          IF(event_name='session_start',1,0) as true_session,         
          e.platform,
          e.device.category AS deviceCategory,
          e.device.operating_system AS operatingSystem,
          e.device.operating_system_version as operatingSystemInfo,
          e.device.web_info.browser as browser,
          e.device.web_info.browser_version as browserVersion, 
          e.geo.country as country,
          e.geo.region as region,
          e.geo.city as city,          
          IF(traffic_source.source is null, '(not set)', traffic_source.source) as user_source,
          IF(traffic_source.medium is null, '(not set)', traffic_source.medium) user_medium,
          IF(traffic_source.name is null, '(not set)', traffic_source.name) user_campaign,
        --utm markup
          (SELECT MAX(IF(ep.key='source', ep.value.string_value, null)) FROM UNNEST(e.event_params) AS ep) AS source,
          (SELECT MAX(IF(ep.key='medium', ep.value.string_value, null)) FROM UNNEST(e.event_params) AS ep) AS medium,
          (SELECT MAX(IF(ep.key='campaign', ep.value.string_value, null)) FROM UNNEST(e.event_params) AS ep) AS campaign,
          (SELECT MAX(IF(ep.key='term', ep.value.string_value, null)) FROM UNNEST(e.event_params) AS ep) AS keyword,
          (SELECT MAX(IF(ep.key='content', ep.value.string_value, null)) FROM UNNEST(e.event_params) AS ep) AS adContent,
          (SELECT MAX(IF(ep.key='gclid', ep.value.string_value, null)) FROM UNNEST(e.event_params) AS ep) AS gclid,          
          1 as hits,
          IF(event_name='page_view',1,0) as pageviews,
          IF(event_name<>'page_view',1,0) as events,
          IF(event_name='purchase',e.ecommerce.transaction_id,null) as transaction_id,
          IF(event_name='purchase',e.ecommerce.purchase_revenue,0.0) as transactionRevenue,
          IF(event_name='user_engagement',1,0) as not_bounces,
          0.0 as cost,
          0 as impressions,
          0 as clicks          
      FROM
        input AS i, `{{source_project_id}}.{{source_dataset_id}}.events_*` AS e
      WHERE
        _TABLE_SUFFIX BETWEEN i.date_start AND i.date_end
        --AND
        --e.event_name NOT IN ('first_open') --'app_remove','app_clear_data','os_update','app_update'
    ),

  events_utm AS
    (
      SELECT
        * EXCEPT(fullPath),
        IF(event_name='session_start',SUBSTR(fullPath,LENGTH(CONCAT((SPLIT(fullPath,'/')[ORDINAL(1)]),(SPLIT(fullPath,'/')[ORDINAL(2)]),(SPLIT(fullPath,'/')[ORDINAL(3)])))+3,LENGTH(fullPath)),null) as landingPage,
        IF(event_name='session_start',SPLIT(fullPath,'/')[ORDINAL(3)],null) as landingHost,        
        SUBSTR(fullPath,LENGTH(CONCAT((SPLIT(fullPath,'/')[ORDINAL(1)]),(SPLIT(fullPath,'/')[ORDINAL(2)]),(SPLIT(fullPath,'/')[ORDINAL(3)])))+3,LENGTH(fullPath)) as page,
        (SPLIT(fullPath,'/')[ORDINAL(3)]) as hostName,        
        CASE
          WHEN gclid IS NOT null THEN 1
          WHEN source IS NOT null OR medium IS NOT null THEN 1
          ELSE null
        END AS utm       
      FROM
        events 
    ),

  sessions_markup AS --setting session_id for events
    (
      SELECT
        * EXCEPT(prev_timestamp, session_start_mark, session_number),
        CONCAT(user_pseudo_id, '_', session_number) AS session_id
      FROM
        (
          SELECT
            *,
            SUM(session_start_mark) OVER W AS session_number
          FROM
            (
              SELECT
                *,
                CASE --here you can add as many conditions as you like to interrupt the timeline
                  WHEN event_name='session_start' THEN 1
                  WHEN prev_timestamp IS null THEN 1
                  WHEN timestamp-prev_timestamp>session_time*60*1000*1000 THEN 1 -- the maximum interval between hits without breaking the session - 30 minutes by 60 seconds by 1000 ms by 1000 mcs
                  WHEN utm=1 THEN 1
                  ELSE null
                END AS session_start_mark
              FROM
                (
                  SELECT
                    *, LAG(timestamp) OVER (PARTITION BY date, user_pseudo_id ORDER BY timestamp ASC, IF(event_name='session_start', 1, 2) ASC) AS prev_timestamp
                  FROM
                    events_utm
                ), input
            )
            WINDOW W AS
              (
                PARTITION BY date, user_pseudo_id
                ORDER BY timestamp ASC, IF(event_name='session_start', 1, 2) ASC
                ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
              )
        )
    ),

  sessions_array AS --main table level - session for one date
    (
      SELECT
        * EXCEPT(session_source, session_medium, session_campaign, session_keyword, session_adContent, source, medium, campaign, keyword, adContent, gclid, events, u), 
        CASE
          WHEN session_id is not null THEN IFNULL(session_source,'(direct)')
          ELSE IF(gclid IS NOT null, 'google', IFNULL(source, '(direct)')) 
        END AS session_source,
        CASE
          WHEN session_id is not null THEN IFNULL(session_medium,'(none)')
          ELSE IF(gclid IS NOT null, 'cpc', IFNULL(medium, '(none)')) 
        END AS session_medium, 
        CASE
          WHEN session_id is not null THEN IFNULL(session_campaign,null)
          ELSE IF(gclid IS NOT null, IF(source='google' AND medium='cpc', campaign, null), campaign)
        END AS session_campaign, 
        CASE
          WHEN session_id is not null THEN IFNULL(session_keyword,null)
          ELSE IF(gclid IS NOT null, IF(source='google' AND medium='cpc', keyword, null), keyword)
        END AS session_keyword, 
        CASE
          WHEN session_id is not null THEN IFNULL(session_adContent,null)
          ELSE IF(gclid IS NOT null, IF(source='google' AND medium='cpc', adContent, null), adContent)
        END AS session_adContent,                         
        gclid,
        u, events
      FROM
        (
          SELECT
            * EXCEPT(events),
            --utm markup
              (SELECT source FROM UNNEST(events) AS e WHERE e.utm=1) AS source,
              (SELECT medium FROM UNNEST(events) AS e WHERE e.utm=1) AS medium,
              (SELECT campaign FROM UNNEST(events) AS e WHERE e.utm=1) AS campaign,
              (SELECT keyword FROM UNNEST(events) AS e WHERE e.utm=1) AS keyword,
              (SELECT adContent FROM UNNEST(events) AS e WHERE e.utm=1) AS adContent,
              (SELECT gclid FROM UNNEST(events) AS e WHERE e.utm=1) AS gclid,
              (SELECT deviceCategory FROM (SELECT deviceCategory, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE deviceCategory IS NOT null) WHERE RN=1) AS deviceCategory,
              (SELECT operatingSystem FROM (SELECT operatingSystem, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE operatingSystem IS NOT null) WHERE RN=1) AS operatingSystem,
              (SELECT operatingSystemInfo FROM (SELECT operatingSystemInfo, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE operatingSystemInfo IS NOT null) WHERE RN=1) AS operatingSystemInfo,
              (SELECT browser FROM (SELECT browser, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE browser IS NOT null) WHERE RN=1) AS browser,
              (SELECT browserVersion FROM (SELECT browserVersion, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE browserVersion IS NOT null) WHERE RN=1) AS browserVersion,
              (SELECT country FROM (SELECT country, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE country IS NOT null) WHERE RN=1) AS country,
              (SELECT region FROM (SELECT region, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE region IS NOT null) WHERE RN=1) AS region,
              (SELECT city FROM (SELECT city, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS RN FROM UNNEST(events) AS e WHERE city IS NOT null) WHERE RN=1) AS city,              
            ARRAY(
              SELECT AS STRUCT
                *
              FROM
                UNNEST(events)
              ORDER BY timestamp ASC
            ) AS events
          FROM
            (
              SELECT
                date,
                dataSource,
                user_pseudo_id,
                session_id as pseudo_session_id,                
                MAX(landingHost) as landingHost,   
                MAX(landingPage) as landingPage,                
                MAX(session_start_id) as session_id,
                MAX(session_source) as session_source,
                MAX(session_medium) as session_medium,
                MAX(session_campaign) as session_campaign,
                MAX(session_keyword) as session_keyword,
                MAX(session_adContent) as session_adContent,
                MAX(true_session) as isTrueSession,
                MIN(timestamp) AS sStart,
                MAX(timestamp) AS sEnd,
                MAX(user_source) as user_source,
                MAX(user_medium) as user_medium,
                MAX(user_campaign) as user_campaign,
                ARRAY(--here is the full list of user_ids that occur in sessions
                  SELECT AS STRUCT
                    user_id AS id
                  FROM
                    sessions_markup AS t2
                  WHERE
                    t2.date=t1.date
                    AND
                    t2.user_pseudo_id=t1.user_pseudo_id
                    AND
                    t2.session_id=t1.session_id
                    AND
                    user_id IS NOT null
                  GROUP BY 1
                ) AS u,
                ARRAY(
                  SELECT AS STRUCT
                    * EXCEPT(date, user_pseudo_id, session_id,session_start_id,true_session,landingPage,landingHost,dataSource, user_source, user_medium, user_campaign, session_source, session_medium, session_campaign, session_keyword, session_adContent)
                  FROM
                    sessions_markup AS t2
                  WHERE
                    t2.date=t1.date
                    AND
                    t2.user_pseudo_id=t1.user_pseudo_id
                    AND
                    t2.session_id=t1.session_id
                ) AS events
              FROM
                sessions_markup AS t1
              GROUP BY 1,2,3,4
            )
        )
    )

SELECT * FROM sessions_array
