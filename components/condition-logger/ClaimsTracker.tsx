"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ClaimEvent {
  id: string;
  date: string;
  title: string;
  notes: string;
}

export const ClaimsTracker = () => {
  const [events, setEvents] = useState<ClaimEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<ClaimEvent, "id">>({
    date: new Date().toISOString().split("T")[0],
    title: "",
    notes: ""
  });

  // Load events from localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem("claimEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    localStorage.setItem("claimEvents", JSON.stringify(events));
  }, [events]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast.error("Please enter an event title");
      return;
    }

    const event: ClaimEvent = {
      id: Date.now().toString(),
      ...newEvent
    };

    setEvents((prev) => [...prev, event].sort((a, b) => a.date.localeCompare(b.date)));
    setNewEvent({
      date: new Date().toISOString().split("T")[0],
      title: "",
      notes: ""
    });

    toast.success("Claim event added successfully");
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents((prev) => prev.filter((event) => event.id !== id));
      toast.success("Event deleted successfully");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VA Claims Timeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new event form */}
        <div className="space-y-4 rounded-md border p-4">
          <h3 className="text-sm font-medium">Add New Event</h3>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={newEvent.date}
                onChange={handleInputChange}
                aria-label="Event date"
              />
            </div>
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Claim Filed, C&P Exam, Decision Received"
                value={newEvent.title}
                onChange={handleInputChange}
                aria-label="Event title"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional details about this event"
                value={newEvent.notes}
                onChange={handleInputChange}
                aria-label="Event notes"
              />
            </div>
            <Button onClick={handleAddEvent} className="w-full" aria-label="Add event to timeline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add to Timeline
            </Button>
          </div>
        </div>

        {/* Timeline */}
        {events.length > 0 ? (
          <div className="before:bg-border relative space-y-4 pl-6 before:absolute before:top-2 before:left-2 before:h-[calc(100%-16px)] before:w-0.5">
            {events.map((event) => (
              <div key={event.id} className="relative pb-4">
                <div className="bg-primary absolute -left-6 mt-1.5 h-3 w-3 rounded-full" />
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <time className="text-muted-foreground text-sm">
                      {new Date(event.date).toLocaleDateString()}
                    </time>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEvent(event.id)}
                      aria-label="Delete event">
                      <Trash2 className="text-muted-foreground h-4 w-4" />
                    </Button>
                  </div>
                  <h4 className="font-medium">{event.title}</h4>
                  {event.notes && <p className="text-muted-foreground text-sm">{event.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center">
            <p className="text-muted-foreground text-sm">
              No claim events added yet. Add key dates in your VA claims process above.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
