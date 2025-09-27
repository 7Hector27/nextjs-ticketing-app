import { OrderType } from "@/utils/types";
import { API_URL } from "@/utils/client";

export default class OrderAPI {
  async createOrder({
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

  async getUserOrdersById(id: string) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return res.json();
    } catch (err) {
      console.error("get Orders error:", err);
      return { error: err };
    }
  }

  async getOrderById(id: string) {
    try {
      const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.error(error);
      return {
        error: error,
      };
    }
  }
}
