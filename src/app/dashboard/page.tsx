import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardRouter() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  if (role === "recruiter") {
    redirect("/recruiter/dashboard");
  } else if (role === "candidate") {
    redirect("/candidate/dashboard");
  } else {
    // Fallback or error if no role
    return (
      <div className="p-8 text-center text-red-500">
        Error: User role not defined. Please contact support.
      </div>
    );
  }
}
