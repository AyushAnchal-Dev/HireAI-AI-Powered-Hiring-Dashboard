
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "HireAI – AI-Powered Hiring Platform",
        short_name: "HireAI",
        description: "Automate hiring with AI-driven assessments and code evaluation.",
        start_url: "/",
        display: "standalone",
        background_color: "#060B1A",
        theme_color: "#060B1A",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
        ],
    };
}
