"use client";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { ZonesTable } from "@/components/zones/ZonesTable";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
export default function ZonesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold">DNS Zones</h1>
      </div>
      <OverviewCards />
      <ZonesTable />
    </motion.div>
  );
}
