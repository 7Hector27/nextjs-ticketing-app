import { API_URL } from "@/utils/client";

export default class TicketAPI {
  async validateTicket(qrCodeData: string) {
    try {
      const res = await fetch(`${API_URL}/tickets/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ qrCodeData }),
      });
      return res.json();
    } catch (err) {
      console.error("validateTicket error:", err);
      return { error: err };
    }
  }
}
