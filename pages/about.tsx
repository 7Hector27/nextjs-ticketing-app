import React from "react";

import Navbar from "../components/Navbar/Navbar";

import styles from "./styles.module.scss";
const About = () => {
  return (
    <div className={styles.about}>
      <Navbar />
      <main className={styles.content}>
        <h1>About Qritix</h1>
        <p>
          Qritix is a modern ticketing platform built to make event access
          simple, secure, and reliable. Whether you’re an event organizer or an
          attendee, our goal is to streamline the process of creating,
          distributing, and validating digital tickets.
        </p>
        <section>
          <h2>Our Mission</h2>
          <p>
            We believe in giving both organizers and attendees confidence in
            their event experience. By using secure QR codes and cloud-native
            infrastructure, we ensure tickets are accessible anytime, anywhere.
          </p>
        </section>
        <section>
          <h2>Why Choose Us?</h2>
          <ul>
            <li>Fast and easy ticket creation</li>
            <li>QR code validation for secure entry</li>
            <li>Scalable platform powered by AWS</li>
            <li>Simple dashboard for organizers</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default About;
