-- Update all existing Optional videos to Required
-- This ensures videos like "TEST" will appear in employee dashboards
UPDATE videos SET type = 'Required' WHERE type = 'Optional';