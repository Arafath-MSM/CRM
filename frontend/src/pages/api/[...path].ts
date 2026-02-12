import type { NextApiRequest, NextApiResponse } from "next"

const BACKEND_BASE_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:8000"

function buildTargetUrl(path: string[], query: NextApiRequest["query"]): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (key === "path") continue
    if (Array.isArray(value)) {
      for (const item of value) qs.append(key, item)
    } else if (value !== undefined) {
      qs.append(key, value)
    }
  }
  const queryString = qs.toString()
  const base = `${BACKEND_BASE_URL}/api/${path.join("/")}`
  return queryString ? `${base}?${queryString}` : base
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = Array.isArray(req.query.path) ? req.query.path : []
  const url = buildTargetUrl(path, req.query)

  const headers: Record<string, string> = {}
  if (req.headers["content-type"]) {
    headers["content-type"] = String(req.headers["content-type"])
  }

  const method = req.method || "GET"
  const hasBody = !["GET", "HEAD"].includes(method)
  const init: RequestInit = {
    method,
    headers,
    redirect: "manual",
  }
  if (hasBody && req.body !== undefined) {
    init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body)
  }

  try {
    const upstream = await fetch(url, init)
    const contentType = upstream.headers.get("content-type") || "application/json"
    const raw = await upstream.text()
    res.status(upstream.status)
    res.setHeader("content-type", contentType)
    res.send(raw)
  } catch (error) {
    res.status(502).json({
      detail: "Upstream API unavailable",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
