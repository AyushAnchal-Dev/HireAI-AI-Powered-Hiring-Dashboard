import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function RecruiterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Optional: Check if role is recruiter
    // if (session.user.role !== 'recruiter') redirect('/dashboard');

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black text-white">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
