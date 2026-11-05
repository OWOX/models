-- Operation: Transactions
-- Destination table: transactions
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix, tdw

#Transactions object

  #Set the input data for the calculation

  WITH input AS
    (
      SELECT
          PARSE_DATE('%Y%m%d', {{start_suffix}}) AS date_start,
          PARSE_DATE('%Y%m%d', {{end_suffix}}) AS date_end,
          {{tdw}} AS tdw #Transaction deduplication window          
    ),   
    
  #Selecting transactions from streaming
    transactions_web AS 
      (
        SELECT
          * EXCEPT(RN)
        FROM
          (
            SELECT
              date,    
              pseudo_session_id,
              events.timestamp as time,  
              events.transaction_id AS transactionId,
              events.transactionRevenue AS transactionRevenue,
              CAST(null AS STRING) AS status,
              "WEB" AS touchpoint,            
              ROW_NUMBER () OVER (PARTITION BY events.transaction_id ORDER BY events.timestamp ASC) AS RN
            FROM input AS i, `{{project_id}}.{{dataset_id}}._temp_sessions`,
            UNNEST (events) as events 
            WHERE 
              date BETWEEN DATE_SUB(i.date_start, INTERVAL tdw DAY) AND i.date_end
              AND events.transaction_id IS NOT NULL
          
          )
        WHERE RN=1  
      )

    SELECT 
      date,
      pseudo_session_id,
      transactionId,
      transactionRevenue,
      status,
      touchpoint,
    FROM transactions_web, input AS i
    WHERE date BETWEEN i.date_start AND i.date_end
