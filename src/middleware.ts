import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isRecruiterPath = req.nextUrl.pathname.startsWith("/recruiter");
  const isCandidatePath = req.nextUrl.pathname.startsWith("/candidate");
  const userRole = req.auth?.user?.role as string | undefined;

  // Protect recruiter routes
  if (isRecruiterPath) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // Check role (assuming roles are stored as lowercase based on seed)
    if (userRole !== "recruiter" && userRole !== "RECRUITER") {
      // Redirect unauthorized users to home or a dedicated 403 page
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  // Protect candidate routes
  if (isCandidatePath) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (userRole !== "candidate" && userRole !== "CANDIDATE") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }
});

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
