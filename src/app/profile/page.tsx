import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfileRedirectPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const role = (session.user as any).role;
    if (role === "recruiter") {
        redirect("/recruiter/profile");
    } else {
        redirect("/candidate/profile");
    }
}
