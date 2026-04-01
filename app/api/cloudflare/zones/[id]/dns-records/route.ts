import { NextResponse } from "next/server";
import { cfFetch } from "@/lib/cloudflare";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const per_page = searchParams.get("per_page") || "100";
    const type = searchParams.get("type") || "";
    const search = searchParams.get("search") || "";
    let path = `/zones/${id}/dns_records?page=${page}&per_page=${per_page}`;
    if (type) path += `&type=${type}`;
    if (search) path += `&name.contains=${search}`;
    const data = await cfFetch(path);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch DNS records" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await cfFetch(`/zones/${id}/dns_records`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create DNS record" }, { status: 500 });
  }
}
