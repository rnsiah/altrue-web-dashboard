import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const DJANGO_API_URL = "http://localhost:8000";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[Auth] Authorize called with:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("[Auth] Missing credentials");
          return null;
        }

        try {
          const res = await fetch(`${DJANGO_API_URL}/auth/login/`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          console.log("[Auth] Django response status:", res.status);

          if (!res.ok) {
            console.log("[Auth] Django returned error status");
            return null;
          }

          const data = await res.json();
          console.log("[Auth] Django response:", JSON.stringify(data, null, 2));
          
          const user = data.user || data;
          const token = data.key || data.access_token || data.token;

          console.log("[Auth] Extracted token:", token ? "yes" : "no");
          console.log("[Auth] User data:", user);

          if (!token) {
            console.log("[Auth] No token found, returning null");
            return null;
          }

          const authenticatedUser = {
            id: String(user.id || user.pk || "1"),
            email: user.email || credentials.email,
            name: user.username || user.name || user.email,
            role: user.is_staff ? "admin" : "user",
            accessToken: token,
          };
          
          console.log("[Auth] Returning user:", authenticatedUser);
          return authenticatedUser;
        } catch (error) {
          console.error("[Auth] Exception:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("[JWT Callback] User:", user ? "present" : "null");
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[Session Callback] Token sub:", token.sub);
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
