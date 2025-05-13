import { cn, generateAvatarFallback } from "@/lib/utils";
import useChatStore from "@/store/useChatStore";
import { ChatItemProps } from "../types";
import { Ellipsis } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChatUserDropdown, MessageStatusIcon } from "@/app/dashboard/(auth)/apps/chat/components";
import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator } from "@/components/ui/avatar";

export function ChatListItem({ chat, active }: { chat: ChatItemProps; active: boolean | null }) {
  const { setSelectedChat } = useChatStore();

  const handleClick = (chat: ChatItemProps) => {
    setSelectedChat(chat);
  };

  const unreadMessageCount = chat?.messages?.filter((item) => !item.read) ?? [];

  return (
    <div
      className={cn(
        "group/item hover:bg-muted relative flex min-w-0 cursor-pointer items-center gap-4 px-6 py-4",
        { "dark:bg-muted! bg-gray-200!": active }
      )}
      onClick={() => handleClick(chat)}>
      <Avatar className="overflow-visible md:size-12">
        <AvatarImage src={chat.user?.avatar} alt="avatar image" />
        <AvatarIndicator variant={chat.user?.online_status} />
        <AvatarFallback>{generateAvatarFallback(chat.user?.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 grow">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium">{chat.user?.name}</span>
          <span className="text-muted-foreground flex-none text-xs">{chat.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <MessageStatusIcon status={chat.status} />
          <span className="text-muted-foreground truncate text-start text-sm">
            {chat.last_message}
          </span>
          {unreadMessageCount.length > 0 && (
            <div className="ms-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm text-white">
              {unreadMessageCount.length}
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          "absolute end-0 top-0 bottom-0 flex items-center bg-linear-to-l from-50% px-4 opacity-0 group-hover/item:opacity-100",
          { "from-muted": !active },
          { "dark:from-muted from-gray-200": active }
        )}>
        <ChatUserDropdown>
          <Button size="icon" variant="outline" className="rounded-full">
            <Ellipsis />
          </Button>
        </ChatUserDropdown>
      </div>
    </div>
  );
}
