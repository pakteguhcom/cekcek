"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CloudflareDNSRecord, CreateDNSRecordInput } from "@/types/cloudflare";

export function useDNSRecords(zoneId: string) {
  return useQuery({
    queryKey: ["dns-records", zoneId],
    queryFn: async () => {
      const res = await fetch(`/api/cloudflare/zones/${zoneId}/dns-records`);
      if (!res.ok) throw new Error("Failed to fetch DNS records");
      const data = await res.json();
      return data.result as CloudflareDNSRecord[];
    },
    enabled: !!zoneId,
  });
}

export function useCreateDNSRecord(zoneId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDNSRecordInput) => {
      const res = await fetch(`/api/cloudflare/zones/${zoneId}/dns-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create DNS record");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dns-records", zoneId] }),
  });
}

export function useUpdateDNSRecord(zoneId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      recordId,
      data,
    }: {
      recordId: string;
      data: Partial<CreateDNSRecordInput>;
    }) => {
      const res = await fetch(
        `/api/cloudflare/zones/${zoneId}/dns-records/${recordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to update DNS record");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dns-records", zoneId] }),
  });
}

export function useDeleteDNSRecord(zoneId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (recordId: string) => {
      const res = await fetch(
        `/api/cloudflare/zones/${zoneId}/dns-records/${recordId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete DNS record");
      return res.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dns-records", zoneId] }),
  });
}
