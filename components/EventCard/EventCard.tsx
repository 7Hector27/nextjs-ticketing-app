import React from "react";
import Image from "next/image";
import { format } from "date-fns";

import { EventType } from "@/utils/types";

import styles from "./EventCard.module.scss";
type EventCardProps = {
  event: EventType;
};
const EventCard = ({ event }: EventCardProps) => {
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
  const datePart = format(myDate, "MMMM dd, yyyy");
  const timePart = format(myDate, "hh:mm a");

  return (
    <div className={styles.eventCard}>
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
        <p className={styles.tickets}>
          {availableTickets} /{totalTickets} Tickets
        </p>
      </div>
    </div>
  );
};

export default EventCard;
