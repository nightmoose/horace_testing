# data_foundation_conformed dbt Project

## Overview
dbt project for conformed data foundation in Snowflake, including reference data schema.

## Jira Ticket
Implemented as per [DPEN-2328](https://jira.example.com/browse/DPEN-2328)

## Setup
1. `dbt deps`
2. Configure `~/.dbt/profiles.yml` with Snowflake targets for dev, uat, prod.

Example target:
```
data_foundation_conformed:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: xxx
      ...
```

## Reference Schema Setup (Manual)
Run in Snowflake:

**UAT:**
```
USE DATABASE uat_data_foundation_conformed;
CREATE SCHEMA IF NOT EXISTS reference;
GRANT USAGE ON SCHEMA reference TO ROLE dbt_role;
GRANT CREATE TABLE, CREATE VIEW ON SCHEMA reference TO ROLE dbt_role;
```

**Prod:**
```
USE DATABASE data_foundation_conformed;
CREATE SCHEMA IF NOT EXISTS reference;
GRANT USAGE ON SCHEMA reference TO ROLE dbt_role;
GRANT CREATE TABLE, CREATE VIEW ON SCHEMA reference TO ROLE dbt_role;
```

## Running dbt
```
dbt run --models +reference
dbt test --models +reference
dbt docs generate && dbt docs serve
```

## Usage
Use `{{ ref('countries') }}` or `{{ ref('regions') }}` in other models.

## Deployment
Merge to main, trigger CI/CD for UAT/Prod.