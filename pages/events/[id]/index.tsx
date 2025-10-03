import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { format } from "date-fns";

import FullPageLoader from "@/components/FullPageLoader";
import SiteLayout from "@/components/layouts/siteLayout";
import Toast from "@/components/Toast";

import EventAPI from "@/lib/EventAPI";
import OrderAPI from "@/lib/OrderAPI";
import { formatToUSD } from "@/utils/client";
import { useUser } from "@/context/UserContext";

import styles from "./index.module.scss";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const eventApi = new EventAPI();
  const orderApi = new OrderAPI();
  const { user, loading, refetchUser } = useUser();
  const [toast, setToast] = useState<{
    message: string | React.ReactNode;
    type: "success" | "error";
  } | null>(null);
  // Fetch event data
  const { data: event, isPending } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => (id ? eventApi.getEventById(String(id)) : null),
    enabled: !!id,
  });

  // Handle order creation
  const submitMutation = useMutation({
    mutationFn: ({
      numberOfTickets,
      eventId,
    }: {
      numberOfTickets: number;
      eventId: string;
    }) => orderApi.createOrder({ numberOfTickets, eventId }),
    onSuccess: (data) => {
      console.log(data.order, "order data");
      router.push(
        {
          pathname: "/orders/confirmation",
          query: { orderId: data.order.orderId }, // still nice to have
        },
        undefined,
        { shallow: true }
      );
    },
    onError: (error) => {
      console.error(
        error.message || "An error occurred while creating the order."
      );
      alert(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setToast({
        message: <>Please sign in to continue with purchase</>,
        type: "error",
      });
      return;
    }
    if (!event) return;

    const formData = new FormData(e.currentTarget);
    const numberOfTickets = Number(formData.get("numberOfTickets"));
    submitMutation.mutate({ numberOfTickets, eventId: event.eventId });
  };

  if (isPending) return <FullPageLoader />;
  if (!event) return <p>Event not found</p>;

  const {
    eventId,
    title,
    description,
    date,
    location,
    totalTickets,
    availableTickets,
    price,
    imageUrl,
  } = event;

  const eventDate = new Date(date);
  const datePart = format(eventDate, "MMM dd, yyyy");
  const timePart = format(eventDate, "hh:mm a");

  return (
    <SiteLayout className={styles.eventDetailsPage}>
      <div className={styles.body}>
        <div className={styles.eventCard}>
          <div className={styles.imgWrapper}>
            <Image
              src={imageUrl || "/images/placeholder.png"}
              alt={`${title} image`}
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
                {availableTickets} / {totalTickets}
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
        {/* Purchase form */}
        <form onSubmit={handleSubmit} className={styles.purchaseForm}>
          <h2 className={styles.formHeader}>Ticket Purchase</h2>

          <label htmlFor="numberOfTickets">Number of Tickets</label>
          <select
            id="numberOfTickets"
            name="numberOfTickets"
            className={styles.input}
            required
          >
            {Array.from(
              { length: Math.min(12, availableTickets) },
              (_, i) => i + 1
            ).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className={styles.button}
          >
            {submitMutation.isPending ? "Processing..." : "Buy Ticket"}
          </button>
        </form>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </SiteLayout>
  );
}
