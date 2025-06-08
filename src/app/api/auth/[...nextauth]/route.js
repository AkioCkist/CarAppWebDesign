// src/app/api/auth/[...nextauth]/route.js

import { NextAuth } from "next-auth/app";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcryptjs from "bcryptjs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const authOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        const { data: user, error } = await supabase
          .from("accounts")
          .select("*")
          .eq("phone_number", credentials.phone)
          .single();

        if (error || !user) return null;

        const valid = await bcryptjs.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.account_id,
          name: user.username,
          phone: user.phone_number
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.phone = token.phone;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

// ✅ App Router requires exporting these
export const GET = handler.GET;
export const POST = handler.POST;
