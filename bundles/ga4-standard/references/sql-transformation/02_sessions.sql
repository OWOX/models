-- Operation: Sessions
-- Destination table: sessions
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix

#Preparing sessions object

  WITH input AS
    (
      SELECT
          PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
          PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end
    ) 

  
  SELECT 
    date,
    pseudo_session_id AS pseudo_sessionId,
    session_Id AS sessionId, 
    landingPage,
    landingHost,
    (SELECT MAX(platform) FROM UNNEST(events) AS e) AS touchpoint,
    dataSource,
    sStart as visitStartTime,
    (SELECT MAX(visitNumber) FROM UNNEST(events) AS e) AS visitNumber, 
    IF(session_Id is not null,1,0) as sessions,
    IFNULL((SELECT SUM(hits) FROM UNNEST(events) AS e),0) AS hits,
    IFNULL((SELECT SUM(pageviews) FROM UNNEST(events) AS e),0) AS pageviews,
    IFNULL((SELECT SUM(events) FROM UNNEST(events) AS e),0) AS events,
    IFNULL((SELECT COUNT(DISTINCT transaction_id) FROM UNNEST(events) AS e),0) AS transactions,
    IFNULL((SELECT SUM(transactionRevenue) FROM UNNEST(events) AS e),0) AS transactionRevenue,
    IF((SELECT MAX(not_bounces) FROM UNNEST(events) AS e)=1,0,1) AS bounces,
    sEnd-sStart as timeOnSite,
    IFNULL((SELECT SUM(cost) FROM UNNEST(events) AS e),0) AS cost,
    IFNULL((SELECT SUM(impressions) FROM UNNEST(events) AS e),0) AS impressions,
    IFNULL((SELECT SUM(clicks) FROM UNNEST(events) AS e),0) AS clicks,
    CAST(FARM_FINGERPRINT(CONCAT( --userHash
                IFNULL(CAST(null as STRING), ''),
                IFNULL(CAST(null as STRING),""),  
                IFNULL(CAST(null as STRING),""),    
                IFNULL(user_pseudo_id,""),    
                IFNULL(CAST(null as STRING),""),    
                IFNULL(CAST(null as STRING),"")   
              )) AS STRING) AS userHash,
    CAST(FARM_FINGERPRINT(CONCAT( --userTrafficSourceHash
                  IFNULL(user_source, ''),
                  IFNULL(user_medium, ''),
                  IFNULL(user_campaign, '')
                )) AS STRING) AS userTrafficSourceHash,          
    CAST(FARM_FINGERPRINT(CONCAT( --trafficSourceHash
                  IFNULL(session_source, ''),
                  IFNULL(session_medium, ''),
                  IFNULL(session_campaign, ''),
                  IFNULL(session_keyword, ''),
                  IFNULL(session_adContent, '')
                )) AS STRING) AS trafficSourceHash,              
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
                  IFNULL(deviceCategory, ''),
                  IFNULL(operatingSystem, ''),
                  IFNULL(operatingSystemInfo, ''),
                  IFNULL(browser, ''),
                  IFNULL(browserVersion , '')
                )) AS STRING) AS deviceHash,              
    CAST(FARM_FINGERPRINT(CONCAT( --deviceHash
                  IFNULL(country, ''),
                  IFNULL(region, ''),
                  IFNULL(city, '')                  
                )) AS STRING) AS geoHash                                                             
  FROM input as i, `{{project_id}}.{{dataset_id}}._temp_sessions`
  WHERE date BETWEEN i.date_start AND i.date_end
