import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;

  const targetUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/${
    Array.isArray(path) ? path.join("/") : path
  }`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      ...(req.headers.cookie ? { cookie: req.headers.cookie } : {}),
      ...(req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {}),
    },
    credentials: "include",
    body: ["POST", "PUT", "PATCH"].includes(req.method || "")
      ? JSON.stringify(req.body)
      : undefined,
  });

  // Forward *all* Set-Cookie headers back to browser
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
