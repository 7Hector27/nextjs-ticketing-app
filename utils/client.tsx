import { getApiUrl } from "@/lib/getApiUrl";

export const uploadToS3 = async (file: File, uploadUrl: string) => {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!res.ok) throw new Error("Failed to upload to S3");
};
export const getUploadUrl = async (file: File) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/uploads/url`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie.replace("authToken=", "")}`, // if protected
      },
      body: JSON.stringify({
        fileType: file.type,
        fileName: file.name,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to get upload URL");
  return res.json();
};

export const API_URL = getApiUrl();

export function formatToUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
