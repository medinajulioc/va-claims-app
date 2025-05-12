import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FileUploadDialog } from "@/app/dashboard/(auth)/file-manager/components/file-upload-dialog";

/**
 * ChatFileUpload component
 *
 * Integrates the centralized file upload functionality from the file-manager
 * into the chat interface with a consistent UI style
 */
export function ChatFileUpload() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <FileUploadDialog
            customTrigger={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Paperclip />
              </Button>
            }
          />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top">Upload Files</TooltipContent>
    </Tooltip>
  );
}
