import { EventType } from "@/utils/types";
import { API_URL } from "@/utils/client";

export default class EventAPI {
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

      return res.json(); // parsed response
    } catch (err) {
      console.error("createEvent error:", err);
      return { error: err };
    }
  }
}
