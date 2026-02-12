const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api"

function buildUrl(path: string): string {
  if (path.startsWith("http")) return path
  if (path.startsWith("/")) return `${API_BASE}${path}`
  return `${API_BASE}/${path}`
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path))
  return parseResponse<T>(res)
}

export async function apiPost<T, B = unknown>(path: string, body: B): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  return parseResponse<T>(res)
}
