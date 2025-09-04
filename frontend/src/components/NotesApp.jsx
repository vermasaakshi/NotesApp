// NotesApp.jsx - Main Notes Application Component
// This component handles all CRUD operations and manages the overall app state
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import NoteEditor from './NoteEditor';
import ShareModal from './ShareModal';
import './NotesApp.css';

// Backend API base URL - Replace with your Render URL when deploying
const API_BASE_URL = 'http://localhost:5000/api/notes';

const NotesApp = () => {
  // State management for notes, selected note, and UI states
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Fetch all notes from backend API on component mount
  useEffect(() => {
    fetchAllNotes();
  }, []);

  // API CALLS - All backend connections happen in these functions
  
  /**
   * Fetch all notes from backend
   * Connects to: GET /api/notes
   */
  const fetchAllNotes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch notes');
      
      const data = await response.json();
      setNotes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load notes. Please check if backend is running.');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new note
   * Connects to: POST /api/notes
   */
  const createNote = async (noteData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) throw new Error('Failed to create note');
      
      const newNote = await response.json();
      setNotes(prevNotes => [newNote, ...prevNotes]);
      setSelectedNote(newNote);
      return newNote;
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    }
  };

  /**
   * Update an existing note
   * Connects to: PUT /api/notes/{id}
   */
  const updateNote = async (id, noteData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
      });
      
      if (!response.ok) throw new Error('Failed to update note');
      
      const updatedNote = await response.json();
      setNotes(prevNotes => 
        prevNotes.map(note => note.id === id ? updatedNote : note)
      );
      setSelectedNote(updatedNote);
    } catch (err) {
      setError('Failed to update note');
      console.error('Error updating note:', err);
    }
  };

  /**
   * Delete a note
   * Connects to: DELETE /api/notes/{id}
   */
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      
      // If deleted note was selected, clear selection
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    }
  };

  /**
   * Share a note - Generate public link
   * This would typically involve creating a share ID in the backend
   * Connects to: GET /api/notes/shared/{shareId}
   */
  const shareNote = async (note) => {
    try {
      // In a real implementation, you'd call the backend to generate a shareId
      // For now, we'll simulate this with the note's ID
      const shareId = note.id; // Replace with actual shareId from backend
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      
      setShareUrl(shareUrl);
      setShowShareModal(true);
    } catch (err) {
      setError('Failed to generate share link');
      console.error('Error sharing note:', err);
    }
  };

  // UI EVENT HANDLERS
  
  const handleCreateNote = () => {
    const newNoteData = {
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    createNote(newNoteData);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleSaveNote = (noteData) => {
    if (selectedNote) {
      updateNote(selectedNote.id, {
        ...noteData,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(id);
    }
  };

  const handleShareNote = () => {
    if (selectedNote) {
      shareNote(selectedNote);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button 
            onClick={fetchAllNotes}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notes-app">
      {/* Sidebar - Shows list of all notes */}
      <Sidebar
        notes={notes}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
        isLoading={isLoading}
      />
      
      {/* Main Editor - Shows selected note content */}
      <NoteEditor
        note={selectedNote}
        onSave={handleSaveNote}
        onShare={handleShareNote}
      />
      
      {/* Share Modal - Shows when sharing a note */}
      {showShareModal && (
        <ShareModal
          shareUrl={shareUrl}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default NotesApp;
