"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Search, ExternalLink } from "lucide-react";
import { useZones } from "@/hooks/useZones";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CloudflareZone } from "@/types/cloudflare";

export function ZonesTable() {
  const { data: zones, isLoading, error, refetch } = useZones();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filtered = zones?.filter((z) =>
    z.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-4">Failed to load zones.</p>
        <button onClick={() => refetch()} className="text-orange-500 underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search zones..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Name Servers</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  {search ? "No zones match your search." : "No zones found. Add your domain to Cloudflare to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((zone) => (
                <TableRow
                  key={zone.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/zones/${zone.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {zone.name}
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={zone.status === "active" ? "success" : "warning"}>
                      {zone.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{zone.type}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      {zone.name_servers?.slice(0, 2).map((ns) => (
                        <span key={ns} className="text-xs text-muted-foreground font-mono">{ns}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {zone.created_on ? format(new Date(zone.created_on), "MMM d, yyyy") : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-sm text-muted-foreground">{filtered.length} zone(s) found</p>
    </div>
  );
}
