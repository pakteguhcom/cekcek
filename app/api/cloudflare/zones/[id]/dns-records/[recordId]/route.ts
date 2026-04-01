import { NextResponse } from "next/server";
import { cfFetch } from "@/lib/cloudflare";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string; recordId: string }> }) {
  try {
    const { id, recordId } = await params;
    const body = await request.json();
    const data = await cfFetch(`/zones/${id}/dns_records/${recordId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update DNS record" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string; recordId: string }> }) {
  try {
    const { id, recordId } = await params;
    const data = await cfFetch(`/zones/${id}/dns_records/${recordId}`, { method: "DELETE" });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete DNS record" }, { status: 500 });
  }
}
