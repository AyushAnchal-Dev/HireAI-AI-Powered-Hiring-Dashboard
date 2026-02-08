
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jobs | HireAI",
    description: "Browse and apply for AI-matched job opportunities on HireAI.",
};

export default function JobsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
