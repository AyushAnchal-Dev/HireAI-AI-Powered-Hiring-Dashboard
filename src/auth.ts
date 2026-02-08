import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      authorize: async (credentials) => {
        console.log("Authorize called with:", credentials);
        const { email, password } = loginSchema.parse(credentials)

        const user = await prisma.user.findUnique({
          where: { email },
        })

        console.log("User lookup result:", user);

        if (!user) {
          console.log("User not found in DB");
          return null;
        }

        const u = user as any;

        // Simple password check if user has one (for seeded users who might not have passwords)
        // In a real app, use bcrypt.compare here
        if (u.password && password && u.password !== password) {
          console.log("Password mismatch");
          return null
        }

        console.log("Login successful, returning user");

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.sub || token.id;
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})
