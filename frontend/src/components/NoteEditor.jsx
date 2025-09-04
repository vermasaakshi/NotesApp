// NoteEditor.jsx - Note Editor Component
// Main editing panel for viewing/editing selected notes
import React, { useState, useEffect } from 'react';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onShare }) => {
  // Local state for editing
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Update local state when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setHasChanges(false);
    }
  }, [note]);

  // Handle input changes and mark as dirty
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setHasChanges(true);
  };

  // Save changes to backend
  const handleSave = () => {
    if (note && hasChanges) {
      onSave({
        title: title.trim() || 'Untitled',
        content: content
      });
      setHasChanges(false);
    }
  };

  // Auto-save after 2 seconds of no typing
  useEffect(() => {
    if (hasChanges) {
      const saveTimer = setTimeout(() => {
        handleSave();
      }, 2000);

      return () => clearTimeout(saveTimer);
    }
  }, [title, content, hasChanges]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // No note selected state
  if (!note) {
    return (
      <div className="note-editor">
        <div className="no-note-selected">
          <div className="no-note-content">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" className="no-note-icon">
              <path d="M14 6a2 2 0 0 0-2 2v32a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V12l-6-6H14z"/>
              <path d="M30 6v6h6"/>
              <path d="M18 20h12M18 24h12M18 28h8"/>
            </svg>
            <h3>Select a note to view</h3>
            <p>Choose a note from the sidebar to start reading or editing</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="note-editor">
      {/* Editor Header with Actions */}
      <div className="editor-header">
        <div className="editor-info">
          <div className="note-date">
            {formatDate(note.updatedAt || note.createdAt)}
          </div>
          {hasChanges && (
            <div className="save-indicator">
              <span>Unsaved changes</span>
            </div>
          )}
        </div>
        
        <div className="editor-actions">
          <button
            className="share-button"
            onClick={onShare}
            title="Share note"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
            </svg>
            Share
          </button>
          
          {hasChanges && (
            <button
              className="save-button"
              onClick={handleSave}
              title="Save changes"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Note Title Input */}
      <div className="title-section">
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          autoComplete="off"
        />
      </div>

      {/* Note Content Textarea */}
      <div className="content-section">
        <textarea
          className="content-textarea"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing..."
          rows="20"
        />
      </div>

      {/* Word Count */}
      <div className="editor-footer">
        <div className="word-count">
          {content.trim() ? (
            <>
              {content.trim().split(/\s+/).length} words, {content.length} characters
            </>
          ) : (
            '0 words'
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;