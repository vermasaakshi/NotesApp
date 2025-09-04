// Sidebar.jsx - Notes List Sidebar Component
// Displays all notes in a list format similar to Apple Notes sidebar
import React from 'react';
import './Sidebar.css';

const Sidebar = ({ 
  notes, 
  selectedNote, 
  onSelectNote, 
  onCreateNote, 
  onDeleteNote, 
  isLoading 
}) => {
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get preview text from note content (first line)
  const getPreviewText = (content) => {
    if (!content) return 'No additional text';
    
    const firstLine = content.split('\n')[0];
    return firstLine.length > 40 ? firstLine.substring(0, 40) + '...' : firstLine;
  };

  return (
    <div className="sidebar">
      {/* Sidebar Header with Create Button */}
      <div className="sidebar-header">
        <div className="sidebar-title">
          <h2>Notes</h2>
          <span className="notes-count">{notes.length}</span>
        </div>
        <button 
          className="create-note-button"
          onClick={onCreateNote}
          title="Create new note"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/>
          </svg>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notes...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && notes.length === 0 && (
        <div className="empty-state">
          <p>No notes yet</p>
          <button 
            className="create-first-note"
            onClick={onCreateNote}
          >
            Create your first note
          </button>
        </div>
      )}

      {/* Notes List */}
      {!isLoading && notes.length > 0 && (
        <div className="notes-list">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`note-item ${
                selectedNote && selectedNote.id === note.id ? 'selected' : ''
              }`}
              onClick={() => onSelectNote(note)}
            >
              <div className="note-item-content">
                <div className="note-item-header">
                  <h3 className="note-title">
                    {note.title || 'Untitled'}
                  </h3>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent note selection
                      onDeleteNote(note.id);
                    }}
                    title="Delete note"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M4.5 3V2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1h2.5a.5.5 0 0 1 0 1h-.441l-.443 5.17A1 1 0 0 1 7.623 11H4.377a1 1 0 0 1-.996-.83L2.94 4H2.5a.5.5 0 0 1 0-1H4.5zM5 2.5v.5h2v-.5H5z"/>
                    </svg>
                  </button>
                </div>
                
                <div className="note-meta">
                  <span className="note-date">
                    {formatDate(note.updatedAt || note.createdAt)}
                  </span>
                  <span className="note-preview">
                    {getPreviewText(note.content)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;