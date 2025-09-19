import React from "react";
import Image from "next/image";
import { format } from "date-fns";
import { useRouter } from "next/router";

import { EventType } from "@/utils/types";

import styles from "./EventCard.module.scss";

type EventCardProps = {
  event: EventType;
};
const EventCard = ({ event }: EventCardProps) => {
  const router = useRouter();
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
  } = event;
  const myDate = new Date(date);
  const datePart = format(myDate, "MMM dd, yyyy");
  const timePart = format(myDate, "hh:mm a");

  return (
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
      </div>
    </div>
  );
};

export default EventCard;
