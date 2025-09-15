import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path } = req.query;

  // Build the target URL to your API Gateway
  const targetUrl = `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/${
    Array.isArray(path) ? path.join("/") : path
  }`;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      // Forward Authorization or other headers if needed
      ...(req.headers.authorization
        ? { Authorization: req.headers.authorization }
        : {}),
    },
    body: ["POST", "PUT", "PATCH"].includes(req.method || "")
      ? JSON.stringify(req.body)
      : undefined,
  });

  // Forward Set-Cookie header
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    res.setHeader("Set-Cookie", setCookie);
  }

  // Forward status + body
  const data = await response.text(); // keep it raw (could be JSON or not)
  res.status(response.status).send(data);
}
