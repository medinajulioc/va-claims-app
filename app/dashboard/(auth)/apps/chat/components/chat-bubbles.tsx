import { cn } from "@/lib/utils";
import { Ellipsis, FileIcon, PlayIcon } from "lucide-react";
import { ChatMessageProps } from "../types";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageStatusIcon } from "@/app/dashboard/(auth)/apps/chat/components";
import Image from "next/image";

function TextChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        <div
          className={cn("bg-muted inline-flex rounded-md border p-4", {
            "order-1": message.own_message
          })}>
          {message.content}
        </div>
        <div className={cn({ "order-2": !message.own_message })}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={message.own_message ? "start" : "end"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                {message.own_message && <DropdownMenuItem>Edit</DropdownMenuItem>}
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", {
          "justify-end": message.own_message
        })}>
        <time
          className={cn("text-muted-foreground mt-1 flex items-center text-xs", {
            "justify-end": message.own_message
          })}>
          05:23 PM
        </time>
        {message.own_message && <MessageStatusIcon status="read" />}
      </div>
    </div>
  );
}

function FileChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        <div
          className={cn("bg-muted inline-flex items-start rounded-md border p-4", {
            "order-1": message.own_message
          })}>
          <FileIcon className="me-4 mt-1 size-8 opacity-50" strokeWidth={1.5} />
          <div className="flex flex-col gap-2">
            <div className="text-sm">
              {message.data?.file_name}
              <span className="text-muted-foreground ms-2 text-sm">({message.data?.size})</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Download
              </Button>
              <Button variant="outline" size="sm">
                Preview
              </Button>
            </div>
          </div>
        </div>
        <div className={cn({ "order-2": !message.own_message })}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={message.own_message ? "start" : "end"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                {message.own_message && <DropdownMenuItem>Edit</DropdownMenuItem>}
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", {
          "justify-end": message.own_message
        })}>
        <time
          className={cn("text-muted-foreground mt-1 flex items-center text-xs", {
            "justify-end": message.own_message
          })}>
          05:23 PM
        </time>
        {message.own_message && <MessageStatusIcon status="read" />}
      </div>
    </div>
  );
}

function VideoChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-4">
        <div
          style={{
            backgroundImage: `url(${message?.data?.cover})`
          }}
          className={cn(
            "relative order-1 flex aspect-4/3 w-52 shrink-0 cursor-pointer items-center justify-center self-start rounded-lg bg-cover transition-opacity hover:opacity-90"
          )}>
          <PlayIcon className="size-8 text-white/80" />
          <div className="absolute end-2 top-2 text-xs font-semibold text-white/60">
            {message?.data?.duration}
          </div>
        </div>
        <div className={cn({ "order-2": !message.own_message })}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={message.own_message ? "start" : "end"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                {message.own_message && <DropdownMenuItem>Edit</DropdownMenuItem>}
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", {
          "justify-end": message.own_message
        })}>
        <time
          className={cn("text-muted-foreground mt-1 flex items-center text-xs", {
            "justify-end": message.own_message
          })}>
          05:23 PM
        </time>
        {message.own_message && <MessageStatusIcon status="read" />}
      </div>
    </div>
  );
}

function SoundChatBubble({ message }: { message: ChatMessageProps }) {
  return (
    <div
      className={cn("max-w-(--breakpoint-sm)", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        <div
          className={cn("bg-muted inline-flex gap-4 rounded-md p-4", {
            "relative order-1 flex items-center justify-center": message.own_message
          })}>
          {message.content}
          <audio id="song" className="block w-80" controls>
            <source src={message?.data?.path} type="audio/mpeg" />
          </audio>
        </div>
        <div className={cn({ "order-2": !message.own_message })}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={message.own_message ? "start" : "end"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                {message.own_message && <DropdownMenuItem>Edit</DropdownMenuItem>}
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn("flex items-center gap-2", {
          "justify-end": message.own_message
        })}>
        <time
          className={cn("text-muted-foreground mt-1 flex items-center text-sm", {
            "justify-end": message.own_message
          })}>
          05:23 PM
        </time>
        {message.own_message && <MessageStatusIcon status="read" />}
      </div>
    </div>
  );
}

function ImageChatBubble({ message }: { message: ChatMessageProps }) {
  const images_limit = 4;
  const images = message?.data?.images ?? [];
  const images_with_limit = images.slice(0, images_limit);

  return (
    <div
      className={cn("max-w-(--breakpoint-sm)", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        <div
          className={cn("bg-muted inline-flex gap-4 rounded-md border p-4", {
            "relative order-1 flex items-center justify-center": message.own_message
          })}>
          {message.content}
          {images.length && (
            <div
              className={cn("grid gap-2", {
                "grid-cols-1": images.length === 1,
                "grid-cols-2": images.length > 1
              })}>
              {images_with_limit.map((image, key) => (
                <figure
                  className="relative cursor-pointer overflow-hidden rounded-lg transition-opacity hover:opacity-90"
                  key={key}>
                  <Image
                    src={image}
                    className="aspect-4/3 object-cover"
                    width={100}
                    height={100}
                    alt="shadcn/ui"
                    unoptimized
                  />
                  {key + 1 === images_limit && images.length > images_limit && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-3xl font-semibold text-white">
                      +{images.length - images_with_limit.length}
                    </div>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
        <div className={cn({ "order-2": !message.own_message })}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={message.own_message ? "start" : "end"}>
              <DropdownMenuGroup>
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Star</DropdownMenuItem>
                {message.own_message && <DropdownMenuItem>Edit</DropdownMenuItem>}
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div
        className={cn("mt-1 flex items-center gap-2", {
          "justify-end": message.own_message
        })}>
        <time
          className={cn("text-muted-foreground mt-1 flex items-center text-xs", {
            "justify-end": message.own_message
          })}>
          05:23 PM
        </time>
        {message.own_message && <MessageStatusIcon status="read" />}
      </div>
    </div>
  );
}

export function ChatBubble({ message, type }: { message: ChatMessageProps; type?: string }) {
  switch (type) {
    case "text":
      return <TextChatBubble message={message} />;
    case "video":
      return <VideoChatBubble message={message} />;
    case "sound":
      return <SoundChatBubble message={message} />;
    case "image":
      return <ImageChatBubble message={message} />;
    case "file":
      return <FileChatBubble message={message} />;
    default:
      break;
  }
}
