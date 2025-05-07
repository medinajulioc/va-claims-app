import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CirclePlusIcon, StarIcon } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function SubmitReviewForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CirclePlusIcon /> Submit Review
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>Share your thoughts about this product.</DialogDescription>
        </DialogHeader>
        <form className="mt-4 grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea id="comment" placeholder="Share your thoughts..." rows={4} />
          </div>
          <div className="flex gap-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center gap-1">
              <StarIcon className="size-6 fill-orange-400 text-orange-400" />
              <StarIcon className="size-6 fill-orange-400 text-orange-400" />
              <StarIcon className="size-6 fill-orange-400 text-orange-400" />
              <StarIcon className="fill-muted stroke-muted-foreground size-6" />
              <StarIcon className="fill-muted stroke-muted-foreground size-6" />
            </div>
          </div>
          <Button className="w-full">Submit Review</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
