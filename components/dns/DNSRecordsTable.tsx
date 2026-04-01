"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Copy, Cloud, CloudOff, Pencil, Trash2, RefreshCw, Plus, Search } from "lucide-react";
import { useDNSRecords, useDeleteDNSRecord, useUpdateDNSRecord } from "@/hooks/useDNSRecords";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { DNSRecordFormDialog } from "./DNSRecordForm";
import type { CloudflareDNSRecord } from "@/types/cloudflare";

const TYPE_COLORS: Record<string, string> = {
  A: "bg-blue-500/20 text-blue-400",
  AAAA: "bg-purple-500/20 text-purple-400",
  CNAME: "bg-green-500/20 text-green-400",
  MX: "bg-orange-500/20 text-orange-400",
  TXT: "bg-yellow-500/20 text-yellow-400",
  NS: "bg-cyan-500/20 text-cyan-400",
  SRV: "bg-pink-500/20 text-pink-400",
  CAA: "bg-red-500/20 text-red-400",
  PTR: "bg-indigo-500/20 text-indigo-400",
};

const ITEMS_PER_PAGE = 20;

export function DNSRecordsTable({ zoneId }: { zoneId: string }) {
  const { data: records, isLoading, error, refetch } = useDNSRecords(zoneId);
  const deleteMutation = useDeleteDNSRecord(zoneId);
  const updateMutation = useUpdateDNSRecord(zoneId);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteRecord, setDeleteRecord] = useState<CloudflareDNSRecord | null>(null);
  const [editRecord, setEditRecord] = useState<CloudflareDNSRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return (records ?? []).filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.content.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === "all" || r.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [records, search, typeFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleToggleProxy = async (record: CloudflareDNSRecord) => {
    if (!record.proxiable) return;
    await updateMutation.mutateAsync({
      recordId: record.id,
      data: {
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        proxied: !record.proxied,
      },
    });
    toast.success("Proxy status updated");
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;
    await deleteMutation.mutateAsync(deleteRecord.id);
    toast.success("Record deleted");
    setDeleteRecord(null);
  };

  const types = [...new Set((records ?? []).map((r) => r.type))].sort();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-4">Failed to load DNS records.</p>
        <Button variant="outline" onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 w-56"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Record
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="hidden md:table-cell">TTL</TableHead>
              <TableHead className="hidden sm:table-cell">Proxy</TableHead>
              <TableHead className="hidden lg:table-cell">Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No DNS records found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((record) => (
                <TableRow key={record.id} className="group">
                  <TableCell>
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${TYPE_COLORS[record.type] ?? "bg-muted text-muted-foreground"}`}>
                      {record.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 max-w-[160px]">
                      <span className="truncate font-mono text-sm">{record.name}</span>
                      <button onClick={() => copyToClipboard(record.name)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 max-w-[200px]">
                      <span className="truncate font-mono text-sm">{record.content}</span>
                      <button onClick={() => copyToClipboard(record.content)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {record.ttl === 1 ? "Auto" : `${record.ttl}s`}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {record.proxiable ? (
                      <button onClick={() => handleToggleProxy(record)} title="Toggle proxy">
                        {record.proxied ? (
                          <Cloud className="h-5 w-5 text-orange-400" />
                        ) : (
                          <CloudOff className="h-5 w-5 text-muted-foreground" />
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {record.modified_on ? format(new Date(record.modified_on), "MMM d, yyyy") : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditRecord(record)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteRecord(record)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}

      <DeleteConfirmDialog
        open={!!deleteRecord}
        recordName={deleteRecord?.name ?? ""}
        onConfirm={handleDelete}
        onCancel={() => setDeleteRecord(null)}
        isLoading={deleteMutation.isPending}
      />

      <DNSRecordFormDialog
        open={createOpen || !!editRecord}
        zoneId={zoneId}
        record={editRecord ?? undefined}
        onClose={() => { setCreateOpen(false); setEditRecord(null); }}
      />
    </div>
  );
}
