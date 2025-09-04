package com.notes.NotesApp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.notes.NotesApp.model.Note;
import com.notes.NotesApp.repository.NoteRepo;

@Service
public class NoteService {
    
    @Autowired
    private NoteRepo noteRepository;
    
    // Get all notes
    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }
    
    // Get note by ID
    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }
    
    // Get note by shareId for public access
    public Optional<Note> getNoteByShareId(String shareId) {
        return noteRepository.findByShareId(shareId);
    }
    
    // Create a new note
    public Note createNote(Note note) {
        return noteRepository.save(note);
    }
    
    // Update an existing note
    public Optional<Note> updateNote(Long id, Note noteDetails) {
        return noteRepository.findById(id)
                .map(note -> {
                    note.update(noteDetails.getTitle(), noteDetails.getContent());
                    return noteRepository.save(note);
                });
    }
    
    // Delete a note
    public boolean deleteNote(Long id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }
}