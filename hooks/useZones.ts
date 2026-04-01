"use client";

import { useQuery } from "@tanstack/react-query";
import type { CloudflareZone } from "@/types/cloudflare";

export function useZones() {
  return useQuery({
    queryKey: ["zones"],
    queryFn: async () => {
      const res = await fetch("/api/cloudflare/zones");
      if (!res.ok) throw new Error("Failed to fetch zones");
      const data = await res.json();
      return data.result as CloudflareZone[];
    },
  });
}

export function useZone(id: string) {
  return useQuery({
    queryKey: ["zones", id],
    queryFn: async () => {
      const res = await fetch(`/api/cloudflare/zones/${id}`);
      if (!res.ok) throw new Error("Failed to fetch zone");
      const data = await res.json();
      return data.result as CloudflareZone;
    },
    enabled: !!id,
  });
}
