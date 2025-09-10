export type User = {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "staff";
  createdAt: Date;
  updatedAt: Date;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
  totalTickets: number;
  availableTickets: number;
  price: number;
  organizerId: string;
};

export type Ticket = {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: Date;
  price: number;
  qrCodeData: string;
  createdAt: Date;
  updatedAt: Date;
  status: "valid" | "used";
  seatNumber?: string;
};
