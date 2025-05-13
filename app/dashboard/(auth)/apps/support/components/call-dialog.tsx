"use client";

import React from "react";
import { Phone, PhoneMissedIcon, X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function CallDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <PhoneMissedIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="top-8 flex translate-y-0 items-center justify-between">
        <VisuallyHidden>
          <DialogTitle>Calling...</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={`${process.env.ASSETS_URL}/avatars/04.png`} alt="shadcn/ui avatar" />
          </Avatar>
          <div className="text-lg">Jennica calling ...</div>
        </div>
        <div className="flex gap-4">
          <Button variant="destructive" className="size-12 rounded-full">
            <X />
          </Button>
          <Button
            variant="destructive"
            className="size-12 rounded-full bg-green-600 hover:bg-green-700 dark:bg-green-950">
            <Phone />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
