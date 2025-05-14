// src/components/NoteItem.js
import React from 'react';

const NoteItem = ({ note, isSelected, onClick }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <li 
      className={`note-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(note)}
    >
      <div className="note-title">{note.title}</div>
      <div className="note-date">{formatDate(note.updated_at)}</div>
    </li>
  );
};

export default NoteItem;