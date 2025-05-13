"use client";

import { cn } from "@/lib/utils";
import { Children, useCallback, useEffect, useRef, useState } from "react";
import React from "react";

const useAutoScroll = (containerRef: React.RefObject<HTMLDivElement | null>, enabled: boolean) => {
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTriggered, setScrollTriggered] = useState(false);
  const [newMessageAdded, setNewMessageAdded] = useState(false);
  const prevChildrenCountRef = useRef(0);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = "auto") => {
      if (!containerRef.current) return;
      setScrollTriggered(true);

      const scrollHeight = containerRef.current.scrollHeight;
      containerRef.current.scrollTo({
        top: scrollHeight,
        behavior
      });

      setTimeout(() => {
        setScrollTriggered(false);
      }, 100);
    },
    [containerRef]
  );

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (!container) return;
      setIsScrolling(true);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 100);

      const isAtBottom =
        Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) < 10;
      setAutoScrollEnabled(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [containerRef, enabled]);

  return {
    autoScrollEnabled,
    scrollToBottom,
    isScrolling,
    scrollTriggered,
    newMessageAdded,
    setNewMessageAdded,
    prevChildrenCountRef
  };
};

export type ChatContainerProps = {
  children?: React.ReactNode;
  className?: string;
  empty?: boolean;
  emptyState?: React.ReactNode;
  autoScroll?: boolean;
  scrollToRef?: React.RefObject<HTMLDivElement | null>;
  ref?: React.RefObject<HTMLDivElement | null>;
} & React.HTMLAttributes<HTMLDivElement>;

export function ChatContainer({
  children,
  className,
  empty,
  emptyState,
  autoScroll = true,
  scrollToRef,
  ref,
  ...props
}: ChatContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const localBottomRef = useRef<HTMLDivElement>(null);
  const bottomRef = scrollToRef || localBottomRef;
  const chatContainerRef = ref || containerRef;
  const prevChildrenRef = useRef<React.ReactNode>(null);
  const contentChangedWithoutNewMessageRef = useRef(false);

  const {
    autoScrollEnabled,
    scrollToBottom,
    isScrolling,
    scrollTriggered,
    newMessageAdded,
    setNewMessageAdded,
    prevChildrenCountRef
  } = useAutoScroll(chatContainerRef, autoScroll);

  useEffect(() => {
    const childrenArray = Children.toArray(children);
    const currentChildrenCount = childrenArray.length;

    if (currentChildrenCount > prevChildrenCountRef.current) {
      setNewMessageAdded(true);
    } else if (prevChildrenRef.current !== children) {
      contentChangedWithoutNewMessageRef.current = true;
    }

    prevChildrenCountRef.current = currentChildrenCount;
    prevChildrenRef.current = children;
  }, [children, setNewMessageAdded]);

  useEffect(() => {
    if (!autoScroll) return;

    const scrollHandler = () => {
      if (newMessageAdded) {
        scrollToBottom("smooth");
        setNewMessageAdded(false);
        contentChangedWithoutNewMessageRef.current = false;
      } else if (
        contentChangedWithoutNewMessageRef.current &&
        autoScrollEnabled &&
        !isScrolling &&
        !scrollTriggered
      ) {
        scrollToBottom("smooth");
        contentChangedWithoutNewMessageRef.current = false;
      }
    };

    requestAnimationFrame(scrollHandler);
  }, [
    children,
    autoScroll,
    autoScrollEnabled,
    isScrolling,
    scrollTriggered,
    scrollToBottom,
    newMessageAdded,
    setNewMessageAdded
  ]);

  return (
    <div
      className={cn(
        "bg-background border-border/40 flex h-full w-full flex-col overflow-y-auto rounded-lg border p-4 shadow-sm",
        className
      )}
      role="log"
      ref={chatContainerRef}
      {...props}>
      {empty ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
          {emptyState !== undefined ? (
            emptyState
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-muted rounded-full p-4">
                <div className="bg-muted-foreground/20 size-8 rounded-full" />
              </div>
              <div className="max-w-[420px] space-y-2">
                <h3 className="text-xl font-medium">No messages yet</h3>
                <p className="text-muted-foreground">
                  Start a conversation by sending a message below. You can ask questions about VA
                  claims, benefits, or evidence requirements.
                </p>
                <div className="mt-6 flex flex-col gap-2">
                  <h4 className="text-sm font-medium">Try asking about:</h4>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="bg-muted rounded-md p-3">
                      <p className="font-medium">Claims Help</p>
                      <p className="text-muted-foreground text-sm">
                        How to file a disability claim
                      </p>
                    </div>
                    <div className="bg-muted rounded-md p-3">
                      <p className="font-medium">Evidence Questions</p>
                      <p className="text-muted-foreground text-sm">
                        What evidence do I need for PTSD?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {children}
          <div
            ref={bottomRef}
            className="h-[1px] w-full flex-shrink-0 scroll-mt-4"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
