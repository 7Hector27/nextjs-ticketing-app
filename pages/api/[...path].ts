import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path, ...restQuery } = req.query;

  // Build base target
  let targetUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/${
    Array.isArray(path) ? path.join("/") : path
  }`;

  // Append query string if any
  const queryString = new URLSearchParams(
    Object.entries(restQuery).map(([k, v]) => [k, String(v)])
  ).toString();

  if (queryString) {
    targetUrl += `?${queryString}`;
  }

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(req.headers.cookie ? { cookie: req.headers.cookie } : {}),
      ...(req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {}),
    },
    body:
      req.method && ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined,
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.setHeader("Set-Cookie", setCookie);
  }

  const text = await response.text();
  try {
    res.status(response.status).json(JSON.parse(text));
  } catch {
    res.status(response.status).send(text);
  }
}
