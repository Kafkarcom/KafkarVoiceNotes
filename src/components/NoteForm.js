// src/components/NoteForm.js
import React, { useState, useEffect } from 'react';

const NoteForm = ({ note, onSave, onCancel, isNew = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  
  // Load note data if editing an existing note
  useEffect(() => {
    if (note && !isNew) {
      setTitle(note.title);
      setContent(note.content);
    } else {
      // Clear form if creating new note
      setTitle('');
      setContent('');
    }
  }, [note, isNew]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    onSave({ title, content });
  };
  
  return (
    <form onSubmit={handleSubmit} className="note-form">
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content"
          rows="10"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {isNew ? 'Create Note' : 'Save Changes'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NoteForm;