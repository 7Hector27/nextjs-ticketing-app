import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { format } from "date-fns";

import EventAPI from "@/lib/EventAPI";
import FullPageLoader from "@/components/FullPageLoader";

import { EventType } from "@/utils/types";

import styles from "./index.module.scss";
import Navbar from "@/components/Navbar";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const eventApi = new EventAPI();

  const { data, isPending } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      if (!id) return null;
      const data = await eventApi.getEventById(String(id)); // return parsed JSON
      return data;
    },
    enabled: !!id,
  });

  if (isPending) return <FullPageLoader />;
  if (!data) return <p>Event not found</p>;

  const {
    eventId,
    title,
    description,
    date,
    location,
    createdAt,
    updatedAt,
    totalTickets,
    availableTickets,
    price,
    featured,
    imageUrl,
  } = data;
  const myDate = new Date(date);
  const datePart = format(myDate, "MMM dd, yyyy");
  const timePart = format(myDate, "hh:mm a");

  return (
    <div className={styles.eventDetailsPage}>
      <Navbar />
      <div className={styles.body}>
        <div
          className={styles.eventCard}
          onClick={() => {
            router.push(`/events/${eventId}`);
          }}
        >
          <div className={styles.imgWrapper}>
            <Image
              src={imageUrl ? imageUrl : ""}
              alt="eventImg"
              width={200}
              height={200}
              className={styles.img}
            />
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.date}>
              {datePart}, {timePart}
            </p>
            <p className={styles.location}>{location}</p>
            <p className={styles.tickets}>
              <span>
                {availableTickets} /{totalTickets}
              </span>
              <span> ${price}</span>
            </p>
            <div className={styles.about}>
              <h2>About</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={() => {}} className={styles.purchaseForm}>
          <input
            type="text"
            id="numberOfTickets"
            name="numberOfTickets"
            placeholder="Number of Tickets"
            className={styles.input}
            required
          />
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className={styles.input}
            required
          />
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className={styles.input}
            required
          />
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            className={styles.input}
            required
          />
          <button>Buy Ticket</button>
        </form>
      </div>
    </div>
  );
}
