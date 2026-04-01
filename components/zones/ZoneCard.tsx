import { Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { CloudflareZone } from "@/types/cloudflare";

export function ZoneCard({ zone }: { zone: CloudflareZone }) {
  return (
    <Card className="hover:border-orange-500/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{zone.name}</p>
              <p className="text-xs text-muted-foreground font-mono">{zone.id.slice(0, 8)}...</p>
            </div>
          </div>
          <Badge variant={zone.status === "active" ? "success" : "warning"} className="text-xs">
            {zone.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
