import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import Event from "@/lib/EventAPI";

import { EventType } from "@/utils/types";
import { uploadToS3, getUploadUrl } from "@/utils/client";
import ButtonLoader from "../ButtonLoader";

import styles from "./EventForm.module.scss";

type eventFormProps = {
  setToast: (toast: {
    message: string | React.ReactNode;
    type: "success" | "error";
  }) => void;
};

const EventForm = ({ setToast }: eventFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const eventApi = new Event();

  const createEventMutation = useMutation({
    mutationFn: async (data: EventType) => eventApi.createEvent(data),
    onSuccess: () =>
      setToast({
        message: <>Event created successfully!</>,
        type: "success",
      }),
    onError: (err) => alert(err.message),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const price = formData.get("price") as string;
    const totalTickets = formData.get("totalTickets") as string;
    const featured = formData.get("featured") === "on";
    const dateStr = formData.get("date") as string;
    const timeStr = formData.get("time") as string;

    // Combine into one Date object
    const eventDateTime = new Date(`${dateStr}T${timeStr}:00`);

    // Check if event is in the future
    const now = new Date();
    if (eventDateTime <= now) {
      setToast({
        message: "Please select a future date and time for your event.",
        type: "error",
      });
      return;
    }

    let imageUrl: string | null = null;
    if (file) {
      const { uploadUrl, fileUrl } = await getUploadUrl(file);
      await uploadToS3(file, uploadUrl);
      imageUrl = fileUrl;
    }

    createEventMutation.mutate({
      title,
      description,
      date: eventDateTime,
      location,
      price: Number(price),
      totalTickets: Number(totalTickets),
      featured,
      imageUrl: imageUrl || undefined,
    });

    form.reset();
    setFile(null);
  };

  return (
    <div className={styles.eventForm}>
      {createEventMutation.isPending ? (
        <div className={styles.form}>
          <ButtonLoader className={styles.spinner} />
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2>Events</h2>
            <p>Create and manage your events.</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.formHeader}>Create Event</h2>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Event Name"
              className={styles.input}
              required
            />
            <input
              type="date"
              id="date"
              name="date"
              placeholder="Date "
              className={styles.input}
              required
            />
            <input
              type="time"
              id="time"
              name="time"
              placeholder="Time"
              className={styles.input}
              required
            />
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Location"
              className={styles.input}
              required
            />
            <input
              type="text"
              id="totalTickets"
              name="totalTickets"
              placeholder="Ticket Quantity"
              className={styles.input}
              required
            />
            <input
              type="text"
              id="price"
              name="price"
              placeholder="Ticket Price"
              className={styles.input}
              required
            />
            <textarea
              id="description"
              name="description"
              placeholder="Enter a detailed description of the event..."
              className={styles.textArea}
            />
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <input type="checkbox" name="featured" />
              <span style={{ marginLeft: "8px" }}>
                Mark as Featured (show on home page)
              </span>
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button type="submit" className={styles.button}>
              Save
            </button>
            <button type="button" className={styles.button} onClick={() => {}}>
              Cancel
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default EventForm;
