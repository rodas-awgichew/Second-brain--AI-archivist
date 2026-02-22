
// This file can be used to define shared types across the application.
// For example:
export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export interface File {
  id: string;
  name: string;
  folderId?: string;
  size: number;
  type: string;
  storagePath: string;
  downloadURL: string;
  createdAt: Date | { seconds: number; nanoseconds: number; }; // Accommodate Firestore's serverTimestamp and regular Date
}

export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: Date;
}

export interface ArchivedCardData {
  id: string;
  title: string;
  summary: string;
  type: 'note' | 'image' | 'pdf';
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
