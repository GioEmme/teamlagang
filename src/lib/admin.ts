import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function requireAdmin() {
  const session = await auth();
  if (!session) {
    return {
      error: NextResponse.json({ error: "Non autorizzato" }, { status: 401 }),
    };
  }
  if (session.user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Accesso negato" }, { status: 403 }),
    };
  }
  return { session };
}
