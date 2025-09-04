package com.notes.NotesApp.controller;

import com.notes.NotesApp.model.Note;
import com.notes.NotesApp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*") // Allow all origins for development
public class NoteController {
    
    @Autowired
    private NoteService noteService;
    
    // Get all notes
    @GetMapping
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }
    
    // Get note by ID
    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Optional<Note> note = noteService.getNoteById(id);
        return note.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // Get note by shareId for public access
    @GetMapping("/shared/{shareId}")
    public ResponseEntity<Note> getNoteByShareId(@PathVariable String shareId) {
        Optional<Note> note = noteService.getNoteByShareId(shareId);
        return note.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    // Create a new note
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        // Create a new note with generated timestamps and shareId
        Note newNote = new Note(note.getTitle(), note.getContent());
        return noteService.createNote(newNote);
    }
    
    // Update an existing note
    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        Optional<Note> updatedNote = noteService.updateNote(id, noteDetails);
        return updatedNote.map(ResponseEntity::ok)
                         .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete a note
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        boolean isDeleted = noteService.deleteNote(id);
        if (isDeleted) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}