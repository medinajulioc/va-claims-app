import { Mic, PlusCircleIcon, SendIcon, SmileIcon, Paperclip } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChatFileUpload } from "./chat-file-upload";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";
import useChatStore from "@/store/useChatStore";
import useUserStore from "@/store/useUserStore";
import { getFirstName } from "@/lib/utils";
import { useState } from "react";

export function ChatFooter() {
  const { selectedChat } = useChatStore();
  const { firstName: currentUserFirstName } = useUserStore();
  const [message, setMessage] = useState("");

  // Use recipient's name for the placeholder
  const recipientFirstName = selectedChat?.user ? getFirstName(selectedChat.user.name) : "";
  const placeholder = recipientFirstName ? `Message ${recipientFirstName}...` : "Enter message...";

  const handleSendMessage = () => {
    // In a real app, this would send the message to the backend
    // For now, we'll just clear the input
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="px-2 lg:px-4">
      <div className="bg-muted/80 relative flex items-center rounded-md border shadow-sm">
        <Input
          type="text"
          className="bg-background/20 focus-visible:bg-background/30 focus-visible:ring-primary/30 h-14 border-transparent px-4 pe-32 text-white shadow-transparent! ring-transparent! transition-all duration-200 ease-in-out placeholder:text-gray-300/70 focus-visible:ring-[4px] lg:pe-56"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <div className="absolute end-4 flex items-center gap-1">
          <div className="block lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="hover:bg-background/20 size-10 rounded-full p-0 text-gray-200 hover:text-white">
                  <PlusCircleIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Emoji</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className="w-full px-2 py-1.5">
                    <FileUploadDialog
                      customTrigger={
                        <div className="flex w-full cursor-pointer items-center">Upload Files</div>
                      }
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>Send Voice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-background/20 rounded-full text-gray-200 hover:text-white">
                    <SmileIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Emoji</TooltipContent>
              </Tooltip>
              <ChatFileUpload />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-background/20 rounded-full text-gray-200 hover:text-white">
                    <Mic className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Send Voice</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            variant="outline"
            className="bg-primary/10 border-primary/20 hover:bg-primary/20 hover:border-primary/30 ms-2 text-white transition-colors"
            onClick={handleSendMessage}>
            <span className="hidden lg:inline">Send</span>{" "}
            <SendIcon className="inline size-4 lg:ms-0" />
          </Button>
        </div>
      </div>
    </div>
  );
}
