const CF_BASE_URL = "https://api.cloudflare.com/client/v4";

function getHeaders() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  if (!token) throw new Error("CLOUDFLARE_API_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function cfFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${CF_BASE_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...(options.headers as Record<string, string>) },
  });
  return res.json();
}
