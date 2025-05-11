import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "User Management",
    description: "Manage user accounts and permissions in the admin dashboard",
    canonical: "/bdoc/users"
  });
}
