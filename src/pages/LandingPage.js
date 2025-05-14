// frontend/src/pages/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to NoteTaker</h1>
      <p className="landing-subtitle">Your simple, secure note-taking solution</p>
      
      {isAuthenticated ? (
        <Link to="/notes" className="btn btn-primary">
          Go to My Notes
        </Link>
      ) : (
        <div>
          <Link to="/register" className="btn btn-primary" style={{ marginRight: '10px' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      )}
      
      <div className="landing-features">
        <div className="feature-card">
          <h3>Simple & Easy</h3>
          <p>Clean interface focused on note-taking without distractions</p>
        </div>
        <div className="feature-card">
          <h3>Secure Storage</h3>
          <p>Your notes are securely stored and accessible only to you</p>
        </div>
        <div className="feature-card">
          <h3>Access Anywhere</h3>
          <p>Create and access your notes from any device with a web browser</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;