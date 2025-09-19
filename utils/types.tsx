export type User = {
  id: string;
  name: string;
  email: string;
  role?: "admin" | "staff";
  createdAt: Date;
  updatedAt: Date;
};

export type EventType = {
  eventId?: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdAt?: Date;
  updatedAt?: Date;
  totalTickets: number;
  availableTickets?: number;
  price: number;
  featured?: boolean;
  imageUrl?: string;
};

export type Ticket = {
  ticketId: string;
  eventId: string;
  userId?: string;
  purchaseDate: Date;
  price: number;
  qrCodeData: string;
  createdAt: Date;
  updatedAt: Date;
  status: "valid" | "used";
  seatNumber?: string;
};
export interface Order {
  id: string;
  userId?: string;
  attendeeEmail: string;
  eventId: string;
  ticketIds: string[];
  createdAt: Date;
}
