/**
 * Seeds the `project-media` Storage bucket + `project_media` rows with the
 * real project photos from public/. Idempotent: clears a project's existing
 * media before re-seeding it.
 *
 *   node supabase/seed-media.mjs
 *
 * Needs a running Supabase (local: `npx supabase start`). Uses the service
 * role key so it bypasses RLS — never ship this key to the browser.
 */
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const SUPABASE_URL = process.env.SUPABASE_URL || "http://127.0.0.1:55321";
const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const BUCKET = "project-media";
const PUBLIC_DIR = path.join(process.cwd(), "public");

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

/** project name -> photos. `file` is relative to public/. */
const MEDIA = {
  "Grand Training Hall": [
    { file: "Portfolio/BigroomGym-B.png", phase: "before", caption: "Shell condition on handover" },
    { file: "images/equipment-overhead.jpg", phase: "progress", caption: "Rig and platform layout set out" },
    { file: "Portfolio/BigroomGym-A.png", phase: "after", caption: "Completed training hall", cover: true },
  ],
  "Villa Fitness Suite": [
    { file: "Portfolio/Gym1-B.png", phase: "before", caption: "Original room, pre-strip" },
    { file: "images/home-gym.jpg", phase: "progress", caption: "Joinery dry-fit" },
    { file: "Portfolio/Gym1-A.png", phase: "after", caption: "Completed suite", cover: true },
  ],
  "Obsidian Performance Studio": [
    { file: "Portfolio/dark-B.png", phase: "before", caption: "Bare unit at takeover" },
    { file: "images/dark-gym.jpg", phase: "progress", caption: "Lighting mock-up under review" },
    { file: "Portfolio/dark-A.png", phase: "after", caption: "Completed studio", cover: true },
  ],
  "Aqua Training Pavilion": [
    { file: "Portfolio/Gym2-B.png", phase: "before", caption: "Structural shell, marina side" },
    { file: "images/glass-tower.jpg", phase: "progress", caption: "Glazing line established" },
    { file: "images/cedar-pool.jpg", phase: "progress", caption: "Pool tank waterproofing" },
    { file: "Portfolio/Gym2-A.png", phase: "after", caption: "Pavilion, completed", cover: true },
  ],
  "Emerald Fitness Club": [
    { file: "Portfolio/gym3-B.png", phase: "before", caption: "Core and shell" },
    { file: "images/colonnade-spa.jpg", phase: "progress", caption: "Wet zone first fix" },
    { file: "Portfolio/gym3-A.png", phase: "after", caption: "Club floor, open to members", cover: true },
  ],
  "Nightfall Lap Pool": [
    { file: "Portfolio/pool-B.png", phase: "before", caption: "Excavation complete" },
    { file: "images/spa-lounge.jpg", phase: "progress", caption: "Recovery lounge finishes" },
    { file: "Portfolio/pool-A.png", phase: "after", caption: "Lap pool at night", cover: true },
  ],
  "The Yoga Alcove": [
    { file: "Portfolio/small yoga room-B.png", phase: "before", caption: "Existing spare room" },
    { file: "Portfolio/small yoga room-A.png", phase: "after", caption: "Completed alcove", cover: true },
  ],
  "Cedar Recovery Spa": [
    { file: "images/cave-spa.jpg", phase: "before", caption: "Basement shell" },
    { file: "images/marble-gold.jpg", phase: "progress", caption: "Stone samples on site" },
    { file: "images/cedar-pool.jpg", phase: "after", caption: "Cedar plunge, completed", cover: true },
  ],
};

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

async function main() {
  const { data: projects, error } = await supabase.from("projects").select("id, name");
  if (error) throw new Error(`Could not read projects: ${error.message}`);

  let uploaded = 0;

  for (const [projectName, items] of Object.entries(MEDIA)) {
    const project = projects.find((p) => p.name === projectName);
    if (!project) {
      console.warn(`  ! no project named "${projectName}" — skipped`);
      continue;
    }

    // Idempotent: drop previously-seeded media (rows + files) for this project.
    const { data: old } = await supabase
      .from("project_media")
      .select("storage_path")
      .eq("project_id", project.id);
    if (old?.length) {
      await supabase.storage.from(BUCKET).remove(old.map((o) => o.storage_path));
      await supabase.from("project_media").delete().eq("project_id", project.id);
    }

    for (const [i, item] of items.entries()) {
      const abs = path.join(PUBLIC_DIR, item.file);
      const ext = path.extname(abs).toLowerCase();
      const body = await readFile(abs);
      const storagePath = `${project.id}/${randomUUID()}${ext}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, body, { contentType: MIME[ext] ?? "image/jpeg", upsert: true });
      if (upErr) throw new Error(`Upload failed for ${item.file}: ${upErr.message}`);

      const { error: rowErr } = await supabase.from("project_media").insert({
        project_id: project.id,
        storage_path: storagePath,
        phase: item.phase,
        caption: item.caption,
        sort_order: i,
        is_cover: Boolean(item.cover),
      });
      if (rowErr) throw new Error(`Row insert failed for ${item.file}: ${rowErr.message}`);

      uploaded++;
    }

    console.log(`  ✓ ${projectName} — ${items.length} photos`);
  }

  console.log(`\nDone. ${uploaded} photos uploaded across ${Object.keys(MEDIA).length} projects.`);
}

main().catch((e) => {
  console.error("Seed failed:", e.message);
  process.exit(1);
});
