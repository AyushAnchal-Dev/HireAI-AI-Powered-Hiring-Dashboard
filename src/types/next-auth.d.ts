import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string; // Ensure id is also typed correctly if used
    } & DefaultSession["user"];
  }
}
