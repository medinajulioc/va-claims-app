"use client";

import Link from "next/link";
import { generateAvatarFallback } from "@/lib/utils";
import { Dribbble, Facebook, FileText, Instagram, Linkedin, SheetIcon, X } from "lucide-react";
import useChatStore from "@/store/useChatStore";
import { UserPropsTypes } from "@/app/dashboard/(auth)/apps/chat/types";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export function UserDetailSheet({ user }: { user: UserPropsTypes }) {
  const { showProfileSheet, toggleProfileSheet } = useChatStore();

  return (
    <Sheet open={showProfileSheet} onOpenChange={toggleProfileSheet}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">Profile</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4">
          <div className="my-4 flex flex-col items-center justify-end">
            <Avatar className="mb-4 size-32">
              <AvatarImage src={user.avatar} alt="avatar image" />
              <AvatarFallback>{generateAvatarFallback(user.name)}</AvatarFallback>
            </Avatar>
            <h4 className="mb-2 text-xl font-semibold">{user.name}</h4>
            <div className="text-xs">
              Last seen:{" "}
              {user.online_status == "success" ? (
                <span className="text-green-500">Online</span>
              ) : (
                <span className="text-muted-foreground">{user.last_seen}</span>
              )}
            </div>
          </div>
          <div className="space-y-2 divide-y">
            {user.about && (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">About</h5>
                <div className="text-muted-foreground">{user.about}</div>
              </div>
            )}
            {user.phone && (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">Phone</h5>
                <div className="text-muted-foreground">{user.phone}</div>
              </div>
            )}
            {user.country && (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">Country</h5>
                <div className="text-muted-foreground">{user.country}</div>
              </div>
            )}
            {user.medias?.length && (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">Media</h5>
                <div>
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 *:shrink-0">
                      {user.medias.map((item) => (
                        <>
                          {item.type === "image" && (
                            <div>
                              <Image
                                width={40}
                                height={40}
                                className="size-20 rounded-lg"
                                src={`${item.path}`}
                                alt="shadcn/ui"
                                unoptimized
                              />
                            </div>
                          )}
                          {item.type === "pdf" && (
                            <div>
                              <Link
                                href={item.path ?? "#"}
                                className="flex aspect-square w-20 items-center justify-center rounded-lg bg-green-200">
                                <SheetIcon className="h-8 w-8 text-green-500" />
                              </Link>
                            </div>
                          )}
                          {item.type === "file" && (
                            <div>
                              <a
                                href="#"
                                className="flex aspect-square w-20 items-center justify-center rounded-lg bg-orange-200">
                                <FileText className="h-8 w-8 text-orange-500" />
                              </a>
                            </div>
                          )}
                          {item.type === "excel" && (
                            <div>
                              <a
                                href="#"
                                className="flex aspect-square w-20 items-center justify-center rounded-lg bg-orange-200">
                                <FileText className="h-8 w-8 text-orange-500" />
                              </a>
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
            )}
            {user.website && (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">Website</h5>
                <div>
                  <a
                    href={user.website}
                    target="_blank"
                    className="text-muted-foreground hover:text-primary hover:underline">
                    {user.website}
                  </a>
                </div>
              </div>
            )}
            {user.social_links?.length && (
              <div className="space-y-3 py-4">
                <h5 className="text-xs font-semibold uppercase">Social Links</h5>
                <div className="flex flex-wrap items-center gap-2 *:shrink-0">
                  {user.social_links.map((item, key) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="size-12 rounded-full"
                      size="icon"
                      asChild>
                      <Link
                        href="#"
                        target="_blank"
                        className="flex items-center justify-center rounded-full *:h-5 *:w-5">
                        {item.name === "Facebook" && <Facebook />}
                        {item.name === "X" && <X />}
                        {item.name === "Dribbble" && <Dribbble />}
                        {item.name === "Linkedin" && <Linkedin />}
                        {item.name === "Instagram" && <Instagram />}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
