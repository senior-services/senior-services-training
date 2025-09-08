-- Seed 10 HR & Policy videos (idempotent)
WITH seed(title, description, video_url, type) AS (
  VALUES
    ('Employee Handbook Overview', 'Overview of key policies, expectations, and resources found in a typical employee handbook.', 'https://www.youtube.com/watch?v=CD6YAskuA2s', 'Required'),
    ('Code of Conduct and Ethics', 'Understanding standards of professional behavior, conflicts of interest, and reporting concerns.', 'https://www.youtube.com/watch?v=-gRLHf6ZBM4', 'Required'),
    ('Anti-Harassment and Anti-Discrimination', 'Recognize, prevent, and report workplace harassment and discrimination to build an inclusive culture.', 'https://www.youtube.com/watch?v=A9gudpiQ40M', 'Required'),
    ('Workplace Safety and Incident Reporting', 'How to identify hazards, report incidents and near misses, and follow OSHA-aligned practices.', 'https://www.youtube.com/watch?v=tP1iSb-UOOg', 'Required'),
    ('Timekeeping and Attendance', 'Best practices for accurate time entry, attendance expectations, and handling exceptions.', 'https://www.youtube.com/watch?v=3df6Qioou0k', 'Required'),
    ('Paid Time Off and Leaves of Absence', 'PTO basics, leave types, approvals, documentation, and employee responsibilities.', 'https://www.youtube.com/watch?v=DYUgGLJtFxI', 'Required'),
    ('Information Security and Data Privacy', 'Core principles of data protection, secure handling of information, and privacy awareness.', 'https://www.youtube.com/watch?v=HwdFfav3LI4', 'Required'),
    ('Social Media and Communications Policy', 'Guidelines for responsible social media use and representing the company appropriately online.', 'https://www.youtube.com/watch?v=ebxiwbgl7ZQ', 'Required'),
    ('Workplace Violence Prevention', 'Recognize warning signs, de-escalation strategies, and reporting procedures.', 'https://www.youtube.com/watch?v=z3PALEyuqWQ', 'Required'),
    ('Drug-Free Workplace and Reasonable Suspicion', 'Overview of substance use risks, reasonable suspicion indicators, and support resources.', 'https://www.youtube.com/watch?v=tCeicv8apFQ', 'Required')
)
INSERT INTO public.videos (title, description, video_url, type, completion_rate)
SELECT s.title, s.description, s.video_url, s.type, 0
FROM seed s
LEFT JOIN public.videos v
  ON lower(v.title) = lower(s.title)
WHERE v.id IS NULL;