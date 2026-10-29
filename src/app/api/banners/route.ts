import { NextResponse } from "next/server";
import { getActiveBanners } from "@/lib/banners";

export const runtime = "nodejs";
// Le pagine statiche (home, pista…) sono generate al deploy: i banner
// arrivano da qui a ogni visita, così compaiono subito anche lì.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banners = await getActiveBanners();
    return NextResponse.json(
      { banners },
      { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30" } },
    );
  } catch (err) {
    console.error("api/banners failed", err);
    return NextResponse.json({ banners: [] }, { status: 500 });
  }
}
