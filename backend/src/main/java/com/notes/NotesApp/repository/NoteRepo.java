package com.notes.NotesApp.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.notes.NotesApp.model.Note;

@Repository
public interface NoteRepo extends JpaRepository<Note, Long> {
    // Find note by shareId for public sharing
    Optional<Note> findByShareId(String shareId);
}