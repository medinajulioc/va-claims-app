"use client";

import * as React from "react";
import { format } from "date-fns";
import { Clock, PlusCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Note {
  id: number;
  date: Date;
  text: string;
}

export function Notes() {
  const [notes, setNotes] = React.useState<Note[]>([
    { id: 1, date: new Date(2025, 10, 15), text: "Dr. Smith's surgery at 10 AM" },
    { id: 2, date: new Date(2025, 4, 15), text: "Staff meeting at 2 PM" },
    { id: 3, date: new Date(2025, 2, 16), text: "New patient orientation" },
    { id: 4, date: new Date(2025, 1, 16), text: "Inventory check" },
    { id: 5, date: new Date(2025, 2, 15), text: "Staff meeting at 2 PM" },
    { id: 6, date: new Date(2025, 3, 15), text: "Staff meeting at 2 PM" }
  ]);
  const [newNote, setNewNote] = React.useState("");

  const addNote = () => {
    if (newNote.trim()) {
      const newNoteObj: Note = {
        id: Date.now(),
        date: new Date(),
        text: newNote.trim()
      };
      setNotes([...notes, newNoteObj]);
      setNewNote("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {notes.map((note, key) => (
            <Link href="#" key={key} className="flex items-center justify-between py-3">
              <span>{note.text}</span>
              <span className="text-muted-foreground flex items-center text-sm">
                <Clock className="me-2 size-4" /> {format(note.date, "MMM d, yyyy")}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="relative flex w-full space-x-4">
          <Input
            placeholder="Add a new note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addNote()}
          />
          <Button onClick={addNote}>
            <PlusCircle />
            Add Note
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
