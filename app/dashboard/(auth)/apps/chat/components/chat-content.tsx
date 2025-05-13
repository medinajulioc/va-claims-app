"use client";

import { useEffect, useRef } from "react";
import useChatStore from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";
import { ChatMessageProps } from "../types";
import { getFirstName } from "@/lib/utils";

import {
  ChatHeader,
  ChatBubble,
  ChatFooter,
  UserDetailSheet
} from "@/app/dashboard/(auth)/apps/chat/components";
import Image from "next/image";

export function ChatContent() {
  const { selectedChat } = useChatStore();
  const { firstName: currentUserFirstName } = useUserStore();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView(false);
    }
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <figure className="hidden h-full items-center justify-center text-center lg:flex">
        <Image
          width={200}
          height={200}
          className="block max-w-sm dark:hidden"
          src={`${process.env.DASHBOARD_BASE_URL}/not-selected-chat.svg`}
          alt="shadcn/ui"
          unoptimized
        />
        <Image
          width={200}
          height={200}
          className="hidden max-w-sm dark:block"
          src={`${process.env.DASHBOARD_BASE_URL}/not-selected-chat-light.svg`}
          alt="shadcn/ui"
        />
      </figure>
    );
  }

  const recipientFirstName = getFirstName(selectedChat.user?.name);
  const messages = selectedChat.messages || [];
  const hasMessages = messages.length > 0;

  return (
    <div className="bg-background fixed inset-0 z-50 flex h-full flex-col p-4 lg:relative lg:z-10 lg:bg-transparent lg:p-0">
      <ChatHeader user={selectedChat.user} />
      <div className="flex-1 overflow-y-auto lg:px-4">
        <div ref={messagesContainerRef}>
          <div className="flex flex-col items-start space-y-10 py-8">
            {!hasMessages && (
              <div className="mx-auto my-6 text-center">
                <p className="text-muted-foreground mb-2">
                  👋 Hi {currentUserFirstName}! Welcome to your chat with {recipientFirstName}.
                </p>
                <p className="text-muted-foreground">
                  Start a conversation by sending a message below.
                </p>
              </div>
            )}
            {hasMessages &&
              messages.map((item: ChatMessageProps, key) => (
                <ChatBubble message={item} type={item.type} key={key} />
              ))}
          </div>
        </div>
      </div>
      <ChatFooter />
      <UserDetailSheet user={selectedChat.user} />
    </div>
  );
}
