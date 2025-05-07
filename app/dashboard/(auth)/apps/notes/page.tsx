import { generateMeta } from "@/lib/utils";
import NotesApp from "@/app/dashboard/(auth)/apps/notes/note-app";

export async function generateMetadata() {
  return generateMeta({
    title: "Service Notes",
    description:
      "Add, organize and manage your service-related medical notes and disability documentation. Track symptom history and medical appointments for your VA claims.",
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
