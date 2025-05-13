"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export default function BillingPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Billing information updated",
      description: "Your billing information has been updated successfully."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-muted-foreground text-sm">
          Manage your subscription and payment methods
        </p>
      </div>

      <Card id="billing">
        <CardHeader>
          <CardTitle>Subscription Plan</CardTitle>
          <CardDescription>
            You are currently on the <strong>Pro Plan</strong> billed monthly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="pro" className="grid gap-4 md:grid-cols-2">
            <div>
              <RadioGroupItem value="free" id="free" className="peer sr-only" />
              <Label
                htmlFor="free"
                className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4">
                <div className="space-y-1 text-center">
                  <h4 className="font-semibold">Free</h4>
                  <p className="text-muted-foreground text-sm">Basic features for personal use</p>
                  <div className="text-2xl font-bold">$0/mo</div>
                </div>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="pro" id="pro" className="peer sr-only" />
              <Label
                htmlFor="pro"
                className="border-muted hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary flex cursor-pointer flex-col items-center justify-between rounded-md border-2 p-4">
                <div className="space-y-1 text-center">
                  <h4 className="font-semibold">Pro</h4>
                  <p className="text-muted-foreground text-sm">
                    Advanced features for professionals
                  </p>
                  <div className="text-2xl font-bold">$15/mo</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Update your billing details and payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name on card</Label>
                <Input id="name" placeholder="John Doe" defaultValue="Toby Belhome" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="number">Card number</Label>
                <Input
                  id="number"
                  placeholder="**** **** **** 4242"
                  defaultValue="**** **** **** 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry date</Label>
                  <Input id="expiry" placeholder="MM/YY" defaultValue="04/25" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="***" defaultValue="***" />
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-end px-0 pt-5">
              <Button type="submit">Save payment method</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
