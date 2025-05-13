"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useChatStore from "@/store/useChatStore";

export function ChatUserDropdown({ children }: { children: React.ReactNode }) {
  const { toggleProfileSheet } = useChatStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => toggleProfileSheet(true)}>View profile</DropdownMenuItem>
          <DropdownMenuItem>Add to archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Block</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
