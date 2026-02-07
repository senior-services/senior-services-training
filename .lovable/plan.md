

# Fix Employee Name Display — Implementation Plan

## Problem
Employee names show as email prefixes (e.g., "jbowers") instead of full names (e.g., "Jerilyn Bowers") because the `employees` table has NULL `full_name` values even though the correct names exist in the `profiles` table.

## Two Database Migrations (No Code Changes)

### Migration 1: Backfill existing data
A one-time update that copies names from the `profiles` table into `employees` where the name is currently missing. Only fills blanks — never overwrites existing names.

### Migration 2: Update the sign-up trigger
Modifies the `handle_new_user` function so that if an employee row already exists but has no name, the name gets filled in automatically on the next sign-up event. Uses `ON CONFLICT ... DO UPDATE` with a guard to only update when the name is NULL or empty.

## Scope
- 0 frontend files changed
- 2 database migrations
- No new functionality added
- Low risk — only fills missing data, never overwrites

