"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useCreateDNSRecord, useUpdateDNSRecord } from "@/hooks/useDNSRecords";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { CloudflareDNSRecord } from "@/types/cloudflare";

const schema = z.object({
  type: z.string().min(1, "Type required"),
  name: z.string().min(1, "Name required"),
  content: z.string().min(1, "Content required"),
  ttl: z.number().int().min(1),
  priority: z.number().int().min(0).optional(),
  proxied: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const DNS_TYPES = ["A", "AAAA", "CNAME", "TXT", "MX", "SRV", "NS", "CAA", "PTR"];
const TTL_OPTIONS = [
  { label: "Auto", value: 1 },
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "30 min", value: 1800 },
  { label: "1 hr", value: 3600 },
  { label: "2 hr", value: 7200 },
  { label: "5 hr", value: 18000 },
  { label: "12 hr", value: 43200 },
  { label: "1 day", value: 86400 },
];

interface Props {
  open: boolean;
  zoneId: string;
  record?: CloudflareDNSRecord;
  onClose: () => void;
}

export function DNSRecordFormDialog({ open, zoneId, record, onClose }: Props) {
  const createMutation = useCreateDNSRecord(zoneId);
  const updateMutation = useUpdateDNSRecord(zoneId);
  const isEdit = !!record;

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "A", ttl: 1, proxied: false },
  });

  useEffect(() => {
    if (record) {
      reset({
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl,
        priority: record.priority,
        proxied: record.proxied,
      });
    } else {
      reset({ type: "A", name: "", content: "", ttl: 1, proxied: false });
    }
  }, [record, reset, open]);

  const type = watch("type");
  const proxied = watch("proxied");
  const showProxy = ["A", "AAAA", "CNAME"].includes(type);
  const showPriority = type === "MX";

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && record) {
        await updateMutation.mutateAsync({ recordId: record.id, data });
        toast.success("Record updated");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Record created");
      }
      onClose();
    } catch {
      toast.error(isEdit ? "Failed to update record" : "Failed to create record");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit DNS Record" : "Add DNS Record"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setValue("type", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DNS_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="@ or subdomain" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Input placeholder="Value" {...register("content")} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          {showPriority && (
            <div className="space-y-2">
              <Label>Priority</Label>
              <Input type="number" placeholder="10" {...register("priority", { valueAsNumber: true })} />
            </div>
          )}

          <div className="space-y-2">
            <Label>TTL</Label>
            <Select
              value={String(watch("ttl"))}
              onValueChange={(v) => setValue("ttl", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TTL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showProxy && (
            <div className="flex items-center justify-between">
              <div>
                <Label>Proxied</Label>
                <p className="text-xs text-muted-foreground">Route through Cloudflare</p>
              </div>
              <Switch checked={proxied ?? false} onCheckedChange={(v) => setValue("proxied", v)} />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
