import { NextResponse } from "next/server";
import { getCanvasConfig } from "@/lib/canvasCatalog";

/**
 * The Space Canvas catalog for the public configurator at /space-canvas/:
 * materials, equipment, space types and what they contain, features, and the
 * pricing rules — everything managed in /admin/canvas.
 */
export async function GET() {
  const config = await getCanvasConfig();
  if (!config) {
    return NextResponse.json({ error: "The catalog is unavailable." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(config, { headers: { "Cache-Control": "no-cache" } });
}
