import { OrderType } from "@/utils/types";
import { API_URL } from "@/utils/client";

export default class OrderAPI {
  async createorder({
    numberOfTickets,
    eventId,
  }: {
    numberOfTickets: number;
    eventId: string;
  }) {
    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ numberOfTickets, eventId }),
      });

      return res.json();
    } catch (err) {
      console.error("createorder error:", err);
      return { error: err };
    }
  }
}
