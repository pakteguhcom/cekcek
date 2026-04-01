"use client";

import { Globe, Activity, PauseCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useZones } from "@/hooks/useZones";
import { format } from "date-fns";

export function OverviewCards() {
  const { data: zones, isLoading } = useZones();

  const totalZones = zones?.length ?? 0;
  const activeZones = zones?.filter((z) => z.status === "active").length ?? 0;
  const pausedZones = zones?.filter((z) => z.paused).length ?? 0;
  const lastUpdated = zones?.reduce((latest, z) => {
    const d = new Date(z.modified_on);
    return d > latest ? d : latest;
  }, new Date(0));

  const cards = [
    { label: "Total Zones", value: totalZones, icon: Globe, color: "text-blue-400" },
    { label: "Active Zones", value: activeZones, icon: Activity, color: "text-green-400" },
    { label: "Paused Zones", value: pausedZones, icon: PauseCircle, color: "text-yellow-400" },
    {
      label: "Last Updated",
      value: lastUpdated && lastUpdated.getTime() > 0 ? format(lastUpdated, "MMM d, HH:mm") : "-",
      icon: Clock,
      color: "text-orange-400",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
