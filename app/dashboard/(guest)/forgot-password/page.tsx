"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2Icon, MailIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    console.log("Form submitted with:", data);
    toast.success("Request submitted!");

    return false;
  };

  return (
    <div className="flex items-center justify-center py-4 lg:h-screen">
      <Card className="mx-auto w-96">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&#39;ll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform opacity-30" />
                        <Input
                          {...field}
                          id="email"
                          type="email"
                          autoComplete="email"
                          className="w-full pl-10"
                          placeholder="Enter your email addresss"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </>
                ) : (
                  "Send Reset Instructions"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm">
            Already have an account?{" "}
            <a href="/dashboard/login/v2" className="underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
