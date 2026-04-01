"use client";
import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Globe } from "lucide-react";
import { useZone } from "@/hooks/useZones";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DNSRecordsTable } from "@/components/dns/DNSRecordsTable";

export default function ZoneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: zone, isLoading } = useZone(id);
  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8 w-64" /><Skeleton className="h-32 w-full" /><Skeleton className="h-96 w-full" /></div>;
  if (!zone) return <div className="text-center py-12 text-muted-foreground">Zone not found.</div>;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/zones" className="hover:text-foreground transition-colors">Zones</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{zone.name}</span>
      </nav>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <Globe className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{zone.name}</h1>
          <p className="text-sm text-muted-foreground font-mono">{zone.id}</p>
        </div>
        <Badge variant={zone.status === "active" ? "success" : "warning"} className="ml-2">{zone.status}</Badge>
      </div>
      <Card>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><p className="text-xs text-muted-foreground mb-1">Zone ID</p><p className="font-mono text-sm">{zone.id}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Type</p><p className="capitalize">{zone.type}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Name Servers</p><div className="space-y-0.5">{zone.name_servers?.map(ns => <p key={ns} className="font-mono text-xs">{ns}</p>)}</div></div>
        </CardContent>
      </Card>
      <Tabs defaultValue="dns">
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="dns">DNS Records</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>
        <TabsContent value="overview" className="mt-4"><Card><CardContent className="p-6 text-muted-foreground">Zone overview coming soon.</CardContent></Card></TabsContent>
        <TabsContent value="dns" className="mt-4"><DNSRecordsTable zoneId={id} /></TabsContent>
        <TabsContent value="settings" className="mt-4"><Card><CardContent className="p-6 text-muted-foreground">Zone settings coming soon.</CardContent></Card></TabsContent>
      </Tabs>
    </motion.div>
  );
}
