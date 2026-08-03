-- ============================================================
-- Allow PARTIAL enquiries so the AI concierge can capture a lead from the
-- first detail it learns and keep enriching the same row — no lead is lost
-- if the visitor drops off mid-conversation. name/email/project_type/message
-- become nullable; the admin shows "—" / a PARTIAL hint for what's missing.
-- ============================================================

alter table enquiries alter column name drop not null;
alter table enquiries alter column email drop not null;
alter table enquiries alter column project_type drop not null;
alter table enquiries alter column message drop not null;
