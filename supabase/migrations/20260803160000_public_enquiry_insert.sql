-- ============================================================
-- The public marketing site is back (merged into this app), so the
-- public enquiry form must be able to create an enquiry again. Anon may
-- INSERT only — never read, update, or delete. Managers/sales still own
-- everything else via the RBAC policies.
-- ============================================================

drop policy if exists "public can submit enquiries" on enquiries;
create policy "public can submit enquiries"
  on enquiries
  for insert
  to anon
  with check (true);

grant insert on enquiries to anon;
