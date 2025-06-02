import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt"; // bcrypt is not used in your provided authorize function

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
        console.log("[NextAuth] Authorize called. Action:", action); // General log

        if (action === "register") {
          console.log("[NextAuth] Attempting registration for phone:", phone, "name:", name);
          try {
            const apiRequestBody = {
              phone_number: phone,
              password: password,
              username: name, // Sending 'name' from form as 'username' to PHP
            };
            console.log("[NextAuth] Calling register.php with body:", JSON.stringify(apiRequestBody));

            const res = await fetch("http://localhost/myapi/register.php", { // Ensure this URL is correct and accessible from your Next.js backend
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(apiRequestBody),
            });

            console.log("[NextAuth] register.php response status:", res.status);
            const responseText = await res.text(); // Get raw text to check for non-JSON errors
            console.log("[NextAuth] register.php raw response text:", responseText);

            let data;
            try {
              data = JSON.parse(responseText); // Attempt to parse the raw text
              console.log("[NextAuth] register.php parsed JSON data:", data);
            } catch (e) {
              console.error("[NextAuth] Failed to parse JSON from register.php:", e);
              console.error("[NextAuth] Response text that caused parsing error was:", responseText);
              return null; // If JSON parsing fails, authorization fails
            }

            // Check for success and user object from register.php
            if (res.ok && data.success && data.user && data.user.account_id) {
              console.log("[NextAuth] Registration successful via API. Returning user data to NextAuth:", data.user);
              return { // This object is passed to the JWT callback
                id: data.user.account_id.toString(), // Ensure ID is a string
                name: data.user.username,
                phone: data.user.phone_number,
                // avatar: data.user.avatar || null, // Add if avatar is returned by register.php
              };
            } else {
              console.error("[NextAuth] Registration via API failed or data.user not found, or account_id missing.");
              console.error("[NextAuth] Full API response data from register.php:", data);
              if (data && data.error) {
                console.error("[NextAuth] API error message from register.php:", data.error);
              }
              return null; // Explicitly return null on failure
            }
          } catch (error) {
            console.error("[NextAuth] Error during fetch to register.php or subsequent processing:", error);
            return null;
          }
        }

        // Login logic (existing)
        if (action === "login") { // Assuming 'login' is the action string for login
            console.log("[NextAuth] Attempting login for phone:", phone);
            try {
                const loginRes = await fetch("http://127.0.0.1/myapi/login.php", { // Ensure this URL is correct
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone_number: phone,
                        password: password,
                    }),
                });

                console.log("[NextAuth] login.php response status:", loginRes.status);
                const loginResponseText = await loginRes.text();
                console.log("[NextAuth] login.php raw response text:", loginResponseText);

                let loginData;
                try {
                    loginData = JSON.parse(loginResponseText);
                    console.log("[NextAuth] login.php parsed JSON data:", loginData);
                } catch(e) {
                    console.error("[NextAuth] Failed to parse JSON from login.php:", e);
                    console.error("[NextAuth] Response text that caused parsing error was:", loginResponseText);
                    return null;
                }
                
                if (loginRes.ok && loginData?.success && loginData.user) {
                    console.log("[NextAuth] Login successful via API. Returning user data to NextAuth:", loginData.user);
                    return {
                        id: (loginData.user.id || loginData.user.account_id).toString(),
                        name: loginData.user.name || loginData.user.username,
                        phone: loginData.user.phone_number,
                        avatar: loginData.user.avatar || null,
                    };
                } else {
                    console.error("[NextAuth] Login via API failed or user data not found in response.");
                    console.error("[NextAuth] Full API response data from login.php:", loginData);
                     if (loginData && loginData.error) {
                        console.error("[NextAuth] API error message from login.php:", loginData.error);
                    }
                    return null;
                }
            } catch (error) {
                console.error("[NextAuth] Error during fetch to login.php or subsequent processing:", error);
                return null;
            }
        }
        
        console.warn("[NextAuth] Authorize function reached end without specific action match or success. Action was:", action);
        return null; // Default failure if action doesn't match or other conditions fail
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("[NextAuth JWT Callback] Trigger:", trigger);
      if (user) { // 'user' is the object returned from authorize
        console.log("[NextAuth JWT Callback] User object present:", user);
        token.id = user.id;
        token.phone = user.phone;
        token.name = user.name;
        if (user.avatar) { // Only assign avatar if it exists
          token.avatar = user.avatar;
        }
      }
      // For session updates (e.g., profile update)
      if (trigger === "update" && session?.user) {
        console.log("[NextAuth JWT Callback] Updating token with session data:", session.user);
        token.name = session.user.name;
        token.phone = session.user.phone;
        token.avatar = session.user.avatar;
      }
      console.log("[NextAuth JWT Callback] Returning token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth Session Callback] Token received:", token);
      if (token && token.id) {
        session.user.id = token.id;
        session.user.phone = token.phone;
        session.user.name = token.name;
        if (token.avatar) { // Only assign avatar if it exists
          session.user.avatar = token.avatar;
        }
      } else {
        console.warn("[NextAuth Session Callback] Token missing id, user data might be incomplete in session.");
      }
      console.log("[NextAuth Session Callback] Returning session:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login", // Your custom login page
  },
  // Optional: Add for more detailed NextAuth internal logs
  // debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };