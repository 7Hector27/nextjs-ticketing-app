import { EventType } from "@/utils/types";
import { API_URL } from "@/utils/client";

export default class EventAPI {
  async getEvents(params: Record<string, string | number | boolean> = {}) {
    try {
      const finalParams = { ...params };

      const query = new URLSearchParams(
        Object.entries(finalParams).map(([key, value]) => [key, String(value)])
      ).toString();

      const url = `${API_URL}/events?${query}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      return data;
    } catch (error) {
      console.error("getEvents error:", error);
      return { error };
    }
  }

  async getEventById(id: string) {
    try {
      const res = await fetch(`${API_URL}/events/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      return res.json();
    } catch (err) {
      console.error("createEvent error:", err);
      return { error: err };
    }
  }

  async createEvent(event: EventType) {
    try {
      const res = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(event),
      });

      return res.json();
    } catch (err) {
      console.error("createEvent error:", err);
      return { error: err };
    }
  }
}
