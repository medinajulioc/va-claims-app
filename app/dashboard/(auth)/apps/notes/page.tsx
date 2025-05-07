import { generateMeta } from "@/lib/utils";
import NotesApp from "@/app/dashboard/(auth)/apps/notes/note-app";

export async function generateMetadata() {
  return generateMeta({
    title: "Note App",
    description:
      "Add, organize and manage notes with the note app template. Built with shadcn/ui, Next.js and Tailwind CSS.",
    canonical: "/apps/notes"
  });
}

export default function Page() {
  return (
    <div className="h-[calc(100vh-6rem)]">
      <NotesApp />
    </div>
  );
}
