{{ config(materialized='table') }}

WITH countries_data AS (
  SELECT * FROM VALUES
    (1, 'United States', 'US', 'USA', 'North America'),
    (2, 'Canada', 'CA', 'CAN', 'North America'),
    (3, 'Mexico', 'MX', 'MEX', 'North America'),
    (4, 'United Kingdom', 'GB', 'GBR', 'Europe'),
    (5, 'Germany', 'DE', 'DEU', 'Europe'),
    (6, 'France', 'FR', 'FRA', 'Europe'),
    (7, 'Japan', 'JP', 'JPN', 'Asia'),
    (8, 'China', 'CN', 'CHN', 'Asia'),
    (9, 'India', 'IN', 'IND', 'Asia'),
    (10, 'Australia', 'AU', 'AUS', 'Oceania'),
    (11, 'Brazil', 'BR', 'BRA', 'South America'),
    (12, 'Argentina', 'AR', 'ARG', 'South America'),
    (13, 'South Africa', 'ZA', 'ZAF', 'Africa'),
    (14, 'Nigeria', 'NG', 'NGA', 'Africa'),
    (15, 'Russia', 'RU', 'RUS', 'Europe'),
    (16, 'Italy', 'IT', 'ITA', 'Europe'),
    (17, 'Spain', 'ES', 'ESP', 'Europe'),
    (18, 'Netherlands', 'NL', 'NLD', 'Europe'),
    (19, 'Sweden', 'SE', 'SWE', 'Europe'),
    (20, 'Norway', 'NO', 'NOR', 'Europe'),
    (21, 'Finland', 'FI', 'FIN', 'Europe'),
    (22, 'Poland', 'PL', 'POL', 'Europe')
)
SELECT 
  id,
  name,
  iso2::VARCHAR as iso2,
  iso3::VARCHAR as iso3,
  continent
FROM countries_data

COMMENT ON TABLE {{ this }} IS 'Reference countries table';

GRANT SELECT ON {{ this }} TO ROLE reporting_role;