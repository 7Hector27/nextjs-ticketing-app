import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { format } from "date-fns";

import EventAPI from "@/lib/EventAPI";
import FullPageLoader from "@/components/FullPageLoader";
import Navbar from "@/components/Navbar";

import { formatToUSD } from "@/utils/client";
import OrderAPI from "@/lib/OrderAPI";

import styles from "./index.module.scss";

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
              <Image
                src={"/images/calendar.png"}
                width={25}
                height={25}
                alt="calendarIcon"
              />
              {datePart}, {timePart}
            </p>
            <p className={styles.location}>
              <Image
                src={"/images/pin.png"}
                width={25}
                height={25}
                alt="pinIcon"
              />
              {location}
            </p>
            <p className={styles.tickets}>
              <Image
                src={"/images/ticket.png"}
                width={25}
                height={25}
                alt="ticketIcon"
              />

              <span>
                {availableTickets} /{totalTickets}
              </span>
            </p>
            <p className={styles.tickets}>
              <Image
                src={"/images/dollarSign.png"}
                width={25}
                height={25}
                alt="dollarSignIcon"
              />
              {formatToUSD(price)}
            </p>
            <div className={styles.about}>
              <h2>About</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>

        <form onSubmit={() => {}} className={styles.purchaseForm}>
          <h2 className={styles.formHeader}>Ticket Purchase</h2>
          <label htmlFor="numberOfTickets">Number of Tickets</label>
          <select
            id="numberOfTickets"
            name="numberOfTickets"
            className={styles.input}
            required
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button className={styles.button}>Buy Ticket</button>
        </form>
      </div>
    </div>
  );
}
