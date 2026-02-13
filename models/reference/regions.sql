{{ config(materialized='table') }}

WITH regions_data AS (
  SELECT * FROM VALUES
    (1, 'California', 1, 'state'),
    (2, 'New York', 1, 'state'),
    (3, 'Texas', 1, 'state'),
    (4, 'Ontario', 2, 'province'),
    (5, 'Quebec', 2, 'province'),
    (6, 'Mexico City', 3, 'city'),
    (7, 'London', 4, 'city'),
    (8, 'Manchester', 4, 'city'),
    (9, 'Berlin', 5, 'city'),
    (10, 'Munich', 5, 'city'),
    (11, 'Paris', 6, 'city'),
    (12, 'Lyon', 6, 'city'),
    (13, 'Tokyo', 7, 'prefecture'),
    (14, 'Osaka', 7, 'prefecture'),
    (15, 'Beijing', 8, 'municipality'),
    (16, 'Shanghai', 8, 'municipality'),
    (17, 'Mumbai', 9, 'state'),
    (18, 'Delhi', 9, 'union territory'),
    (19, 'New South Wales', 10, 'state'),
    (20, 'Victoria', 10, 'state'),
    (21, 'Sao Paulo', 11, 'state'),
    (22, 'Rio de Janeiro', 11, 'state')
)
SELECT 
  r.id,
  r.name,
  r.country_id,
  r.type
FROM regions_data r

COMMENT ON TABLE {{ this }} IS 'Reference regions table';

GRANT SELECT ON {{ this }} TO ROLE reporting_role;