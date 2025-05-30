import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://127.0.0.1/myapi/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: credentials.phone,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if (data?.success) {
          return {
            id: data.user.account_id,
            name: data.user.name || data.user.username,
            phone: data.user.phone_number,
            avatar: data.user.avatar,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.avatar = token.avatar;
      return session;
    },
  },
  pages: {
    signIn: "/login", // optional, your existing login page
  },
});

export { handler as GET, handler as POST };
