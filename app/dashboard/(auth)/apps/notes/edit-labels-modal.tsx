"use client";

import React, { useState } from "react";
import { Trash2, Edit2, Check, X, PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { noteLabels } from "@/app/dashboard/(auth)/apps/notes/data";

interface Props {
  children: React.ReactNode;
}

export function EditLabelsModal({ children }: Props) {
  const [editingLabelId, setEditingLabelId] = useState<number | null>(null);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-red-500");

  const availableColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500"
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-screen max-w-96 overflow-y-scroll lg:overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Labels</DialogTitle>
        </DialogHeader>

        <div>
          {/* Existing labels */}
          <div className="space-y-1">
            {noteLabels.map((label) => (
              <div key={label.id} className="flex items-center justify-between rounded-md py-1">
                {editingLabelId && editingLabelId === label.id ? (
                  <div className="flex flex-1 items-center">
                    <Input defaultValue={label.title} className="me-2 h-8" autoFocus />
                    <Button size="icon" variant="ghost" onClick={() => setEditingLabelId(null)}>
                      <Check />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditingLabelId(null)}>
                      <X />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className={`size-3 shrink-0 rounded-full ${label.color}`} />
                      <span>{label.title}</span>
                      <span className="text-muted-foreground text-xs">6</span>
                    </div>
                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingLabelId(label.id)}>
                        <Edit2 />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="text-red-500" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add new label */}
          <div className="border-t pt-6">
            <h4 className="mb-2 text-sm font-medium">Add New Label</h4>
            <div className="relative flex items-center gap-2">
              <div className="absolute start-3 shrink-0">
                <div className={`size-3 rounded-full ${newLabelColor}`} />
              </div>
              <Input
                placeholder="New label name"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="flex-1 ps-9"
              />
              <Button size="sm" disabled={!newLabelName.trim()}>
                <PlusCircle />
                Add
              </Button>
            </div>

            {/* Color picker */}
            <div className="mt-3">
              <Label className="text-muted-foreground mb-1 block text-xs">Select color</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`size-5 rounded-full ${color} ${
                      newLabelColor === color ? "ring-primary ring-2 ring-offset-2" : ""
                    }`}
                    onClick={() => setNewLabelColor(color)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
