// src/app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcryptjs from "bcryptjs";

// Create Supabase client
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
        try {
          if (!credentials?.phone || !credentials?.password) {
            console.error("Missing phone or password.");
            return null;
          }

          const { data: user, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("phone_number", credentials.phone)
            .single();

          if (error) {
            console.error("Supabase query error:", error);
            return null;
          }

          if (!user) {
            console.error("No user found with that phone number.");
            return null;
          }

          const isPasswordValid = await bcryptjs.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error("Invalid password.");
            return null;
          }

          return {
            id: user.account_id,
            name: user.username,
            phone: user.phone_number
          };
        } catch (err) {
          console.error("Unexpected error in authorize:", err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
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

const { GET, POST } = NextAuth(authOptions);

export { GET, POST };
