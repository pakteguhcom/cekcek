export interface CloudflareZone {
  id: string;
  name: string;
  status: "active" | "paused" | "initializing" | "moved" | "deleted" | "deactivated";
  paused: boolean;
  type: "full" | "partial" | "secondary";
  name_servers: string[];
  original_name_servers: string[];
  created_on: string;
  modified_on: string;
  account: {
    id: string;
    name: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    frequency: string;
    is_subscribed: boolean;
    can_subscribe: boolean;
    legacy_id: string;
    legacy_discount: boolean;
    externally_managed: boolean;
  };
  meta?: {
    step: number;
    wildcard_proxiable: boolean;
    custom_certificate_quota: number;
    page_rule_quota: number;
    phishing_detected: boolean;
    multiple_railguns_allowed: boolean;
  };
  owner?: {
    id: string;
    type: string;
    email: string;
  };
}

export interface CloudflareDNSRecord {
  id: string;
  zone_id: string;
  zone_name: string;
  name: string;
  type: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  meta?: {
    auto_added: boolean;
    source: string;
  };
  created_on: string;
  modified_on: string;
  priority?: number;
  comment?: string;
  tags?: string[];
}

export interface CloudflareResultInfo {
  page: number;
  per_page: number;
  count: number;
  total_count: number;
  total_pages: number;
}

export interface CloudflareResponse<T> {
  result: T;
  success: boolean;
  errors: Array<{ code: number; message: string }>;
  messages: Array<{ code: number; message: string }>;
}

export interface CloudflareListResponse<T> extends CloudflareResponse<T[]> {
  result_info: CloudflareResultInfo;
}

export interface CreateDNSRecordInput {
  type: string;
  name: string;
  content: string;
  ttl: number;
  priority?: number;
  proxied?: boolean;
  comment?: string;
}
