import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileSearchIcon, LayoutGridIcon, ListIcon, MenuIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddNoteModal } from "@/app/dashboard/(auth)/apps/notes/add-note-modal";
import { Note } from "@/app/dashboard/(auth)/apps/notes/types";
import NoteListItem from "@/app/dashboard/(auth)/apps/notes/note-list-item";
import { notes } from "@/app/dashboard/(auth)/apps/notes/data";
import { NoteMobileSidebar } from "@/app/dashboard/(auth)/apps/notes/note-sidebar";

export default function NoteContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"masonry" | "list">("masonry");

  const filteredNotes = notes.filter((note: Note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="relative flex max-w-md flex-1 space-x-3 xl:space-x-0">
          <NoteMobileSidebar>
            <Button variant="outline" size="icon" className="flex shrink-0 xl:hidden">
              <MenuIcon />
            </Button>
          </NoteMobileSidebar>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              className="w-full pl-10"
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="hidden overflow-hidden rounded-md border xl:flex">
            <Button
              variant={viewMode === "masonry" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("masonry")}>
              <LayoutGridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("list")}>
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="block xl:hidden">
            <AddNoteModal />
          </div>
        </div>
      </div>

      {searchQuery && filteredNotes.length === 0 && (
        <div className="flex h-[calc(100vh-10rem)] flex-col items-center justify-center p-4 text-center">
          <div className="bg-muted/30 mb-4 rounded-full p-6">
            <FileSearchIcon className="text-muted-foreground h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-medium">No notes found</h3>
          <p className="text-muted-foreground max-w-md">
            {`We couldn't find any notes matching "${searchQuery}".`}
          </p>
          {searchQuery && (
            <Button variant="outline" className="mt-4">
              Clear all filters
            </Button>
          )}
        </div>
      )}

      <div
        data-view-mode={viewMode}
        className={cn("group", {
          "box-border columns-1 gap-4 [column-fill:_balance] group-data-[theme-content-layout=centered]/layout:columns-3 group-data-[theme-content-layout=full]/layout:columns-1 sm:group-data-[theme-content-layout=full]:columns-2 md:group-data-[theme-content-layout=full]/layout:columns-3 lg:columns-2 xl:group-data-[theme-content-layout=full]/layout:columns-4":
            viewMode === "masonry"
        })}>
        {filteredNotes.map((note: Note, key: number) => (
          <NoteListItem key={key} note={note} />
        ))}
      </div>
    </div>
  );
}
