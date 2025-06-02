import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Full Name", type: "text" },
        action: { label: "Action", type: "text" }, // "login" or "register"
      },
      async authorize(credentials) {
        const { phone, password, name, action } = credentials;

        if (action === "register") {
          // 1. Gửi dữ liệu đăng ký đến API PHP
          const registerRes = await fetch("http://127.0.0.1/myapi/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone_number: phone,
              password: password, // PHP sẽ hash bằng password_hash
              name: name,
            }),
          });

          const registerData = await registerRes.json();

          if (!registerData.success) {
            throw new Error(registerData.error || "Failed to register");
          }

          // Sau khi tạo tài khoản thành công, tiếp tục đăng nhập
        }

        // 2. Gọi API login.php để lấy user và xác minh mật khẩu
        const loginRes = await fetch("http://127.0.0.1/myapi/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: phone,
            password: password,
          }),
        });

        const loginData = await loginRes.json();

        if (loginData?.success && loginData.user) {
          return {
            id: loginData.user.id || loginData.user.account_id,
            name: loginData.user.name || loginData.user.username, // <-- Fix here
            phone: loginData.user.phone_number,
            avatar: loginData.user.avatar || null,
          };
        }

        return null; // Login thất bại
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.avatar = user.avatar;
        token.name = user.name;
      }

      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.phone = session.user.phone;
        token.avatar = session.user.avatar;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.avatar = token.avatar;
      session.user.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
