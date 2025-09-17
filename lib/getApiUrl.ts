export function getApiUrl() {
  // Running locally => use Next.js API proxy
  if (
    typeof window !== "undefined" &&
    window.location.origin.includes("localhost:3000")
  ) {
    return "/api";
  }

  // Otherwise => use your API Gateway
  return process.env.NEXT_PUBLIC_API_GATEWAY_URL!;
}
