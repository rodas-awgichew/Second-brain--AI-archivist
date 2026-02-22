import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  return (
    <div className="bg-brand-white border border-brand-gray-dark rounded-medium p-4">
      <h3 className="font-bold text-brand-text mb-2">{note.title}</h3>
      <p className="text-sm text-brand-text-light">{note.content}</p>
    </div>
  );
};

export default NoteCard;
