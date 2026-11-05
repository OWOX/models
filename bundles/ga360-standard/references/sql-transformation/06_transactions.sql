-- Operation: Transactions
-- Destination table: transactions
-- Write mode: Append
-- Variables: dataset_id, end_suffix, project_id, start_suffix, tdw

#Transactions object
WITH 
  #Set the date range for the calculation
    dates AS
      ( 
        SELECT
          {{start_suffix}} AS date_start,
          {{end_suffix}} AS date_end,  
          {{tdw}} AS tdw,
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
              sessionId,
              transactionId,
              transactionRevenue,
              CAST(null AS STRING) AS status,
              "WEB" AS touchpoint,            
              ROW_NUMBER () OVER (PARTITION BY transactionId ORDER BY time ASC) AS RN
            FROM dates AS d, `{{project_id}}.{{dataset_id}}._temp_transactions` 
            WHERE date BETWEEN DATE_SUB(PARSE_DATE('%Y%m%d',d.date_start), INTERVAL tdw DAY) AND PARSE_DATE('%Y%m%d',d.date_end)
          )
        WHERE RN=1  
      )

    SELECT
      date,
      sessionId,
      transactionId,
      transactionRevenue,
      status,
      touchpoint
    FROM
      transactions_web as web_data,
      dates as d
   WHERE date BETWEEN PARSE_DATE('%Y%m%d',d.date_start) AND PARSE_DATE('%Y%m%d',d.date_end)
