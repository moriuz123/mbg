import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  // Seed endpoint is disabled in production. The production database is restored separately.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const res = await auth.api.signUpEmail({
      headers: await headers(),
      body: {
        name: "Petugas Inspeksi",
        email: "admin@lebakkab.go.id",
        password: "password123",
      }
    });
    return NextResponse.json({ success: true, message: "Admin created", user: res });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
