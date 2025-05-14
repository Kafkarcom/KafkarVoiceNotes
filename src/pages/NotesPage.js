// frontend/src/pages/NotesPage.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/notes');
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notes');
      setLoading(false);
    }
  };

  // Load notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle note selection
  const handleSelectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Handle creating a new note
  const handleCreateNew = () => {
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setIsEditing(false);
    setIsCreating(true);
  };

  // Handle saving a note (create or update)
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      if (isCreating) {
        // Create new note
        const response = await api.post('/api/notes', { title, content });
        setNotes([...notes, response.data]);
        setSelectedNote(response.data);
        setIsCreating(false);
      } else {
        // Update existing note
        const response = await api.put(`/api/notes/${selectedNote.id}`, { title, content });
        setNotes(notes.map(note => note.id === selectedNote.id ? response.data : note));
        setSelectedNote(response.data);
      }
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to save note');
    }
  };

  // Handle deleting a note
  const handleDelete = async () => {
    if (!selectedNote) return;

    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/api/notes/${selectedNote.id}`);
        setNotes(notes.filter(note => note.id !== selectedNote.id));
        setSelectedNote(null);
        setTitle('');
        setContent('');
        setIsEditing(false);
        setIsCreating(false);
      } catch (err) {
        setError('Failed to delete note');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="notes-container">
      {/* Notes Sidebar */}
      <div className="notes-sidebar">
        <button 
          className="btn btn-primary btn-block" 
          style={{ marginBottom: '20px' }}
          onClick={handleCreateNew}
        >
          Create New Note
        </button>
        
        {loading ? (
          <p>Loading notes...</p>
        ) : notes.length === 0 ? (
          <p>No notes yet. Create your first note!</p>
        ) : (
          <ul className="notes-list">
            {notes.map(note => (
              <li 
                key={note.id} 
                className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
                onClick={() => handleSelectNote(note)}
              >
                <div className="note-title">{note.title}</div>
                <div className="note-date">{formatDate(note.updated_at)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Notes Editor */}
      <div className="notes-editor">
        {error && <div className="form-error" style={{ marginBottom: '15px' }}>{error}</div>}
        
        {(selectedNote || isCreating) ? (
          <>
            <div className="editor-actions">
              {isEditing || isCreating ? (
                <>
                  <button 
                    className="btn btn-success" 
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => {
                      if (isCreating) {
                        setIsCreating(false);
                        setTitle('');
                        setContent('');
                      } else {
                        setIsEditing(false);
                        setTitle(selectedNote.title);
                        setContent(selectedNote.content);
                      }
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isEditing && !isCreating}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!isEditing && !isCreating}
              />
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <p>Select a note from the sidebar or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;