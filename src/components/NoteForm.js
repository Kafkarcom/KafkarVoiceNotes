// src/components/NoteForm.js
import React, { useState, useEffect } from 'react';

const NoteForm = ({ note, onSave, onCancel, isNew = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        
        setContent(prevContent => {
          // If cursor is in middle of text, insert at cursor position
          const textarea = document.getElementById('content');
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = prevContent;
            return text.substring(0, start) + transcript + text.substring(end);
          }
          // Otherwise append to end
          return prevContent + ' ' + transcript;
        });
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        setError('Voice recognition failed. Please try again.');
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      setRecognition(recognition);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);
  
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
  
  const toggleVoiceRecording = () => {
    if (!recognition) {
      setError('Voice recognition is not supported in your browser');
      return;
    }
    
    if (isRecording) {
      recognition.stop();
    } else {
      setError('');
      recognition.start();
      setIsRecording(true);
    }
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
        <div className="content-wrapper">
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content"
            rows="10"
          />
          <button
            type="button"
            className={`btn btn-voice ${isRecording ? 'recording' : ''}`}
            onClick={toggleVoiceRecording}
            title="Click to start/stop voice recording"
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
            <span className="microphone-icon">🎤</span>
          </button>
        </div>
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