import { Mic, Paperclip, PlusCircleIcon, SendIcon, SmileIcon } from "lucide-react";
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

export function ChatFooter() {
  return (
    <div className="lg:px-4">
      <div className="bg-muted relative flex items-center rounded-md border">
        <Input
          type="text"
          className="h-14 border-transparent bg-white pe-32 text-base! shadow-transparent! ring-transparent! lg:pe-56"
          placeholder="Enter message..."
        />
        <div className="absolute end-4 flex items-center">
          <div className="block lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-11 rounded-full p-0">
                  <PlusCircleIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Emoji</DropdownMenuItem>
                <DropdownMenuItem>Add File</DropdownMenuItem>
                <DropdownMenuItem>Send Voice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="hidden lg:block">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <SmileIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Emoji</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Select File</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Send Voice</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button variant="outline" className="ms-3">
            <span className="hidden lg:inline">Send</span> <SendIcon className="inline lg:hidden" />
          </Button>
        </div>
      </div>
    </div>
  );
}
