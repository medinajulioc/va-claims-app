"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { ClientFormDescription } from "@/components/ui/client-form-description";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters."
    })
    .max(30, {
      message: "Username must not be longer than 30 characters."
    }),
  email: z
    .string({
      required_error: "Please select an email to display."
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." })
      })
    )
    .optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: "I own a computer.",
  urls: [{ value: "https://shadcn.com" }, { value: "http://twitter.com/shadcn" }]
};

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("account");

  useEffect(() => {
    // Check if there's a hash in the URL and set the active tab accordingly
    if (window.location.hash === "#billing") {
      setActiveTab("billing");
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "billing") {
      router.push("/dashboard/pages/settings/billing");
    } else if (value === "account") {
      router.push("/dashboard/pages/settings");
    }
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange"
  });

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      )
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="shadcn" {...field} />
                        </FormControl>
                        <ClientFormDescription>
                          This is your public display name. It can be your real name or a pseudonym.
                          You can only change this once every 30 days.
                        </ClientFormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="m@example.com">m@example.com</SelectItem>
                            <SelectItem value="m@google.com">m@google.com</SelectItem>
                            <SelectItem value="m@support.com">m@support.com</SelectItem>
                          </SelectContent>
                        </Select>
                        <ClientFormDescription>
                          You can manage verified email addresses in your{" "}
                          <Link href="/examples/forms">email settings</Link>.
                        </ClientFormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about yourself"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <ClientFormDescription>
                          You can <span>@mention</span> other users and organizations to link to
                          them.
                        </ClientFormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    {fields.map((field, index) => (
                      <FormField
                        control={form.control}
                        key={field.id}
                        name={`urls.${index}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={cn(index !== 0 && "sr-only")}>URLs</FormLabel>
                            <ClientFormDescription className={cn(index !== 0 && "sr-only")}>
                              Add links to your website, blog, or social media profiles.
                            </ClientFormDescription>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ value: "" })}>
                      Add URL
                    </Button>
                  </div>
                  <Button type="submit">Update profile</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="py-10 text-center">
            <p>Redirecting to billing settings...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
