import { generateMeta } from "@/lib/utils";
import path from "path";
import { promises as fs } from "fs";
import { ChatItemProps, UserPropsTypes } from "./types";

import { SupportSidebar, SupportContent } from "./components";

export async function generateMetadata() {
  return generateMeta({
    title: "Support App",
    description:
      "A template to create support and messaging apps for your customers or users. Built with shadcn/ui, Next.js and Tailwind CSS.",
    canonical: "/apps/support"
  });
}

async function getChats() {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/dashboard/(auth)/apps/support/data/chats.json")
  );
  return JSON.parse(data.toString());
}

async function getChatUser(id: number) {
  const data = await fs.readFile(
    path.join(process.cwd(), "app/dashboard/(auth)/apps/support/data/contacts.json")
  );

  return JSON.parse(data.toString()).find((item: UserPropsTypes) => item.id === id);
}

export default async function Page() {
  const chats = await getChats();

  const chats_with_user = await Promise.all(
    chats.map(async (item: ChatItemProps) => {
      item.user = await getChatUser(item.user_id);
      return item;
    })
  );

  return (
    <div className="flex h-[calc(100vh-5.3rem)] w-full">
      <SupportSidebar chats={chats_with_user} />
      <div className="grow">
        <SupportContent />
      </div>
    </div>
  );
}
