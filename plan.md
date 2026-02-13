### Implementation Plan v1.1: Add Reference Schema to Conformed Data Foundation Databases (Improved)

#### List of Files to Create or Modify
- **dbt_project.yml**: Configure dbt to map the new `models/reference/` folder to the `reference` schema.
  Purpose: Central dbt config to define schema overrides for reference models.
- **models/reference/schema.yml**: Define dbt model documentation and tests for the reference schema models.
  Purpose: dbt docs generation and validation.
- **models/reference/countries.sql**: Example static reference model for country lookup table.
  Purpose: Sample reference data model using dbt seeds or select.
- **models/reference/regions.sql**: Example reference model for regions/countries hierarchy.
  Purpose: Demonstrates {{ ref('countries') }} usage.
- **README.md**: Add section on reference schema usage, manual Snowflake setup, and model references.
  Purpose: Onboarding and deployment instructions.
- **models/schema.yml** (if exists, append): Update main models schema to reference the new reference models if needed.

#### Brief Description of Each File's Purpose
- dbt_project.yml: Enables dbt to build models into the correct Snowflake schema.
- schema.yml files: Metadata for lineage, tests, descriptions.
- *.sql models: Transform logic for reference data, using {{ ref() }} for inter-model deps.
- README.md: Guides manual schema creation and verification.

#### High-level Steps and Dependencies
1. Update/create dbt_project.yml (no dependencies).
2. Create models/reference/ directory and files (depends on dbt_project.yml config).
3. Update README.md and any main schema.yml (depends on models created).
4. Commit, dbt compile/run/test (requires Snowflake schema created manually).
Dependencies: 
- DBA to run Snowflake SQL for schema creation/grants in UAT/prod.
- dbt profiles.yml configured locally/CI for targets.

#### Detailed Subtasks (Updated from v1.0)
1. **Snowflake Schema Setup (Manual, Documented in README)**:
   - UAT: `USE DATABASE uat_data_foundation_conformed; CREATE SCHEMA IF NOT EXISTS reference; GRANT USAGE, CREATE TABLE, CREATE VIEW ON SCHEMA reference TO ROLE dbt_role;`
   - Prod: Similar after UAT.

2. **Repo Changes**:
   - Implement file changes as listed.
   - Ensure {{ ref('countries') }} etc. in models.

3. **Testing**:
   - `dbt deps && dbt compile --models reference`
   - `dbt run --models +reference`
   - `dbt test --models +reference`

#### Review Notes
- Previous score: 8/10
- Improvements incorporated: Explicit file list, cleaned code blocks, repo-focus, sample files added, dependencies clarified.

#### Success Criteria & Rollback
- Same as v1.0.
Score for v1.1: 9/10