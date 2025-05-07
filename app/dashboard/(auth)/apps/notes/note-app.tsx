"use client";

import NoteSidebar from "@/app/dashboard/(auth)/apps/notes/note-sidebar";
import NoteContent from "@/app/dashboard/(auth)/apps/notes/note-content";

export default function NotesApp() {
  return (
    <div className="flex items-start lg:space-x-4">
      <NoteSidebar />
      <NoteContent />
    </div>
  );
}
