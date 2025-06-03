import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import Google Provider
import FacebookProvider from "next-auth/providers/facebook"; // Import Facebook Provider

const handler = NextAuth({
  providers: [
    // --- OAuth Providers ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // --- Credentials Provider (for Phone/Password) ---
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
        console.log("[NextAuth] Authorize called. Action:", action);

        if (action === "register") {
          console.log("[NextAuth] Attempting registration for phone:", phone, "name:", name);
          try {
            const apiRequestBody = {
              phone_number: phone,
              password: password,
              username: name,
            };
            console.log("[NextAuth] Calling register.php with body:", JSON.stringify(apiRequestBody));

            const res = await fetch("http://localhost/myapi/register.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(apiRequestBody),
            });

            console.log("[NextAuth] register.php response status:", res.status);
            const responseText = await res.text();
            console.log("[NextAuth] register.php raw response text:", responseText);

            let data;
            try {
              data = JSON.parse(responseText);
              console.log("[NextAuth] register.php parsed JSON data:", data);
            } catch (e) {
              console.error("[NextAuth] Failed to parse JSON from register.php:", e);
              console.error("[NextAuth] Response text that caused parsing error was:", responseText);
              return null;
            }

            if (res.ok && data.success && data.user && data.user.account_id) {
              console.log("[NextAuth] Registration successful via API. Returning user data to NextAuth:", data.user);
              return {
                id: data.user.account_id.toString(),
                name: data.user.username,
                phone: data.user.phone_number,
                // avatar: data.user.avatar || null,
              };
            } else {
              console.error("[NextAuth] Registration via API failed or data.user not found, or account_id missing.");
              console.error("[NextAuth] Full API response data from register.php:", data);
              if (data && data.error) {
                console.error("[NextAuth] API error message from register.php:", data.error);
              }
              return null;
            }
          } catch (error) {
            console.error("[NextAuth] Error during fetch to register.php or subsequent processing:", error);
            return null;
          }
        }

        if (action === "login") {
            console.log("[NextAuth] Attempting login for phone:", phone);
            try {
                const loginRes = await fetch("http://127.0.0.1/myapi/login.php", {
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
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) { // Added account and profile for OAuth data
      console.log("[NextAuth JWT Callback] Trigger:", trigger);
      
      // Initial sign-in (for both Credentials and OAuth)
      if (user) {
        console.log("[NextAuth JWT Callback] User object present:", user);
        token.id = user.id;
        token.name = user.name;
        // For credentials provider, user.phone will be present
        if (user.phone) {
          token.phone = user.phone;
        }
        // For OAuth providers, user.image is typically the avatar
        if (user.image) {
          token.avatar = user.image;
        } else if (user.avatar) { // Fallback for credentials if you return 'avatar'
          token.avatar = user.avatar;
        }
      }

      // If signing in with OAuth, you might want to store provider-specific details
      if (account) {
        console.log("[NextAuth JWT Callback] Account object present:", account);
        token.accessToken = account.access_token; // Store access token if needed for API calls
        token.provider = account.provider; // e.g., 'google', 'facebook'
        // You might want to store the provider-specific ID
        token.providerAccountId = account.id_token || account.providerAccountId;
      }
      
      // For session updates (e.g., profile update)
      if (trigger === "update" && session?.user) {
        console.log("[NextAuth JWT Callback] Updating token with session data:", session.user);
        token.name = session.user.name;
        token.phone = session.user.phone; // Assuming phone might be updated for credentials
        token.avatar = session.user.avatar; // Assuming avatar might be updated
      }
      console.log("[NextAuth JWT Callback] Returning token:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth Session Callback] Token received:", token);
      if (token) { // Check for token existence before accessing properties
        session.user.id = token.id;
        session.user.name = token.name;
        if (token.phone) {
          session.user.phone = token.phone;
        }
        if (token.avatar) {
          session.user.avatar = token.avatar;
        }
        if (token.provider) { // Add provider info to session if helpful
            session.user.provider = token.provider;
        }
      } else {
        console.warn("[NextAuth Session Callback] Token is null or undefined, user data might be incomplete in session.");
      }
      console.log("[NextAuth Session Callback] Returning session:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login", // Your custom login page
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set in your .env.local
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
});

export { handler as GET, handler as POST };