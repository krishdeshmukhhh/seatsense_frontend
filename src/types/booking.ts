export type RoomStatus = 'empty' | 'occupied' | 'bags';

export interface Room {
  id: string;
  name: string;
  roomNumber: string;
  capacity: number;
  status: RoomStatus;
  lastUpdated: string;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomNumber: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'past' | 'cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
}