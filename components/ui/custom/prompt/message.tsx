import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";
import { CopyButton } from "./copy-button";
import { format } from "date-fns";

export type MessageProps = {
  children: React.ReactNode;
  className?: string;
  timestamp?: Date;
  isUser?: boolean;
} & React.HTMLProps<HTMLDivElement>;

const Message = ({ children, className, timestamp, isUser = false, ...props }: MessageProps) => (
  <div className={cn("group mb-4 flex gap-3", isUser ? "justify-end" : "", className)} {...props}>
    {children}
    {timestamp && (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <div className="text-muted-foreground self-end pb-1 text-xs opacity-0 transition-opacity group-hover:opacity-70">
              {format(timestamp, "h:mm a")}
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            {format(timestamp, "MMM d, yyyy h:mm a")}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

export type MessageAvatarProps = {
  src: string;
  alt: string;
  fallback?: string;
  delayMs?: number;
  className?: string;
};

const MessageAvatar = ({ src, alt, fallback, delayMs, className }: MessageAvatarProps) => {
  return (
    <Avatar className={cn("h-8 w-8 shrink-0", className)}>
      <AvatarImage src={src} alt={alt} />
      {fallback && <AvatarFallback delayMs={delayMs}>{fallback}</AvatarFallback>}
    </Avatar>
  );
};

export type MessageContentProps = {
  children: React.ReactNode;
  markdown?: boolean;
  className?: string;
  isUser?: boolean;
} & React.ComponentProps<typeof Markdown> &
  React.HTMLProps<HTMLDivElement>;

const MessageContent = ({
  children,
  markdown = false,
  className,
  isUser = false,
  ...props
}: MessageContentProps) => {
  const classNames = cn(
    "rounded-lg py-3 px-4 text-foreground prose break-words whitespace-normal relative",
    isUser ? "bg-primary/10 shadow-sm" : "bg-secondary shadow-sm",
    className
  );

  return (
    <div className="group animate-fadeIn relative w-full max-w-[85%]">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton text={typeof children === "string" ? children : ""} compact showOnHover />
      </div>
      {markdown ? (
        <Markdown className={classNames} {...props}>
          {children as string}
        </Markdown>
      ) : (
        <div className={classNames} {...props}>
          {children}
        </div>
      )}
    </div>
  );
};

export type MessageActionsProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const MessageActions = ({ children, className, ...props }: MessageActionsProps) => (
  <div className={cn("text-muted-foreground flex items-center gap-2", className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = {
  className?: string;
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
} & React.ComponentProps<typeof Tooltip>;

const MessageAction = ({
  tooltip,
  children,
  className,
  side = "top",
  ...props
}: MessageActionProps) => {
  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { Message, MessageAvatar, MessageContent, MessageActions, MessageAction };
