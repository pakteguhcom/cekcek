import { NextResponse } from "next/server";
import { cfFetch } from "@/lib/cloudflare";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "50";
    const data = await cfFetch(`/zones?page=${page}&per_page=${per_page}`);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch zones" }, { status: 500 });
  }
}
