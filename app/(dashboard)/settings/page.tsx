"use client";
import { motion } from "framer-motion";
import { Settings, Key, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3"><Settings className="w-6 h-6 text-orange-500" /><h1 className="text-2xl font-bold">Settings</h1></div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Key className="w-5 h-5" />API Configuration</CardTitle><CardDescription>Configure your Cloudflare API token</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm font-medium mb-2">Environment Variable</p>
            <code className="text-xs font-mono text-orange-400">CLOUDFLARE_API_TOKEN=your_token_here</code>
            <p className="text-xs text-muted-foreground mt-2">Set this in your <code>.env.local</code> file. The token is never exposed to the client.</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/5 border border-green-500/20">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
            <div><p className="text-sm font-medium text-green-400">Secure by Design</p><p className="text-xs text-muted-foreground mt-1">All Cloudflare API calls are proxied through Next.js route handlers. Your API token is never exposed in the browser.</p></div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
