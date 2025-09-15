import React from "react";

import styles from "./EventForm.module.scss";
const EventForm = () => {
  return (
    <div className={styles.eventForm}>
      <form onSubmit={() => {}} className={styles.form}>
        <h2 className={styles.formHeader}>Create Event</h2>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Event Name"
          className={styles.input}
          required
        />
        <input
          type="text"
          id="date"
          name="date"
          placeholder="Date "
          className={styles.input}
          required
        />
        <input
          type="text"
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
          id="quantity"
          name="quantity"
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
          style={{ display: "flex", alignItems: "center", marginTop: "8px" }}
        >
          <input type="checkbox" name="featured" />
          <span style={{ marginLeft: "8px" }}>
            Mark as Featured (show on home page)
          </span>
        </label>
        <input type="file" accept="image/*" onChange={() => {}} required />
        <button type="button" className={styles.button} onClick={() => {}}>
          Save
        </button>
        <button type="button" className={styles.button} onClick={() => {}}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EventForm;
