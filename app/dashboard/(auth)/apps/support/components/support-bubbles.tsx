import { cn, generateAvatarFallback } from "@/lib/utils";
import { Ellipsis, FileIcon, PlayIcon } from "lucide-react";
import { ChatMessageProps } from "../types";
import { getFirstName } from "@/lib/utils";
import useChatStore from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SupportMessageStatusIcon as MessageStatusIcon } from "./";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

// Helper function to personalize responses
function personalizeResponse(content: string, firstName: string): string {
  // List of patterns to personalize
  const patterns = [
    { regex: /^(hi|hello|hey)(\s|$)/i, replacement: `$1 ${firstName}$2` },
    {
      regex: /^(good morning|good afternoon|good evening)(\s|$)/i,
      replacement: `$1 ${firstName}$2`
    },
    { regex: /^(thank you|thanks)(\s|$)/i, replacement: `$1 ${firstName}$2` },
    { regex: /^(how are you)(\s|$)/i, replacement: `$1 ${firstName}$2` }
  ];

  // Check if the content matches any of our patterns
  for (const pattern of patterns) {
    if (pattern.regex.test(content)) {
      return content.replace(pattern.regex, pattern.replacement);
    }
  }

  return content;
}

export function TextSupportBubble({ message }: { message: ChatMessageProps }) {
  const { selectedChat } = useChatStore();
  const { firstName: currentUserFirstName } = useUserStore();

  // Use recipient's name for messages from the current user (own_message: true)
  // Use current user's name for messages from others (own_message: false)
  const recipientFirstName = selectedChat?.user ? getFirstName(selectedChat.user.name) : "";
  const firstName = message.own_message ? recipientFirstName : currentUserFirstName;

  // Only personalize if we have a name to use
  const content = !firstName
    ? message.content
    : personalizeResponse(message.content || "", firstName);

  // Get the appropriate avatar based on message ownership
  const avatarSrc = message.own_message
    ? process.env.ASSETS_URL + "/avatars/01.png" // Default avatar for LLM/system
    : selectedChat?.user?.avatar; // User's avatar

  const avatarName = message.own_message ? "System" : selectedChat?.user?.name || "User";

  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        {!message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn("bg-muted inline-flex rounded-md border p-4", {
            "order-1": message.own_message
          })}>
          {content}
        </div>
        {message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
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

export function FileSupportBubble({ message }: { message: ChatMessageProps }) {
  const { selectedChat } = useChatStore();

  // Get the appropriate avatar based on message ownership
  const avatarSrc = message.own_message
    ? process.env.ASSETS_URL + "/avatars/01.png" // Default avatar for LLM/system
    : selectedChat?.user?.avatar; // User's avatar

  const avatarName = message.own_message ? "System" : selectedChat?.user?.name || "User";

  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        {!message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
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
        {message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
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

export function VideoSupportBubble({ message }: { message: ChatMessageProps }) {
  const { selectedChat } = useChatStore();

  // Get the appropriate avatar based on message ownership
  const avatarSrc = message.own_message
    ? process.env.ASSETS_URL + "/avatars/01.png" // Default avatar for LLM/system
    : selectedChat?.user?.avatar; // User's avatar

  const avatarName = message.own_message ? "System" : selectedChat?.user?.name || "User";

  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        {!message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
        <Card
          className={cn("w-80 overflow-hidden border p-0", {
            "order-1": message.own_message
          })}>
          <div className="relative">
            <Image
              src={message.data?.cover || ""}
              className="aspect-video object-cover"
              alt="Video cover"
              width={320}
              height={180}
            />
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full">
              <PlayIcon />
            </Button>
          </div>
          <CardContent className="p-3">
            <div className="text-sm">{message.data?.file_name}</div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <span>{message.data?.duration}</span>
              <span>•</span>
              <span>{message.data?.size}</span>
            </div>
          </CardContent>
        </Card>
        {message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
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

export function SoundSupportBubble({ message }: { message: ChatMessageProps }) {
  const { selectedChat } = useChatStore();

  // Get the appropriate avatar based on message ownership
  const avatarSrc = message.own_message
    ? process.env.ASSETS_URL + "/avatars/01.png" // Default avatar for LLM/system
    : selectedChat?.user?.avatar; // User's avatar

  const avatarName = message.own_message ? "System" : selectedChat?.user?.name || "User";

  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        {!message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
        <Card
          className={cn("w-80 overflow-hidden border", {
            "order-1": message.own_message
          })}>
          <CardContent className="p-3">
            <div className="text-sm">{message.data?.file_name}</div>
            <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
              <span>{message.data?.duration}</span>
              <span>•</span>
              <span>{message.data?.size}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Button size="icon" variant="secondary" className="rounded-full">
                <PlayIcon className="h-4 w-4" />
              </Button>
              <div className="bg-muted h-1 flex-1 rounded-full" />
            </div>
          </CardContent>
        </Card>
        {message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
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

export function ImageSupportBubble({ message }: { message: ChatMessageProps }) {
  const { selectedChat } = useChatStore();

  // Get the appropriate avatar based on message ownership
  const avatarSrc = message.own_message
    ? process.env.ASSETS_URL + "/avatars/01.png" // Default avatar for LLM/system
    : selectedChat?.user?.avatar; // User's avatar

  const avatarName = message.own_message ? "System" : selectedChat?.user?.name || "User";

  return (
    <div
      className={cn("max-w-(--breakpoint-sm) space-y-1", {
        "self-end": message.own_message
      })}>
      <div className="flex items-center gap-2">
        {!message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
        <div
          className={cn("bg-muted inline-flex flex-wrap gap-1 rounded-md border p-1", {
            "order-1": message.own_message
          })}>
          {message.data?.images?.map((item, key) => (
            <div key={key} className="overflow-hidden rounded">
              <Image src={item} width={150} height={150} className="size-full" alt="Image" />
            </div>
          ))}
        </div>
        {message.own_message && (
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{generateAvatarFallback(avatarName)}</AvatarFallback>
          </Avatar>
        )}
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

export function SupportBubble({ message, type }: { message: ChatMessageProps; type?: string }) {
  if (type === "file") {
    return <FileSupportBubble message={message} />;
  }

  if (type === "video") {
    return <VideoSupportBubble message={message} />;
  }

  if (type === "sound") {
    return <SoundSupportBubble message={message} />;
  }

  if (type === "image") {
    return <ImageSupportBubble message={message} />;
  }

  return <TextSupportBubble message={message} />;
}
