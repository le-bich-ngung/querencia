/**
 * NextAuth.js — SSO toàn hệ sinh thái Querencia
 * Providers: Google OAuth + Credentials (email/password)
 *
 * Lưu ý đặc biệt:
 * Khi password = '__token__', nghĩa là client đã có access_token từ API
 * (sau MFA hoặc Google callback), chỉ cần wrap vào NextAuth session.
 */
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const API_URL = process.env.API_SERVICE_URL ?? 'http://localhost:3001';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:        { label: 'Email',         type: 'email' },
        password:     { label: 'Password',      type: 'password' },
        accessToken:  { label: 'Access Token',  type: 'text' },
        refreshToken: { label: 'Refresh Token', type: 'text' },
      },
      async authorize(creds) {
        if (!creds?.email) return null;

        // Case 1: Token passthrough (sau MFA / Google redirect)
        if (creds.password === '__token__' && creds.accessToken) {
          // Fetch user info bằng token đã có
          const res = await fetch(`${API_URL}/api/v1/auth/me`, {
            headers: { Authorization: `Bearer ${creds.accessToken}` },
          });
          if (!res.ok) return null;
          const user = await res.json();
          return {
            id:           user.id,
            email:        user.email,
            name:         user.name,
            plan:         user.plan,
            accessToken:  creds.accessToken,
            refreshToken: creds.refreshToken ?? '',
          };
        }

        // Case 2: Email + password thường
        const res = await fetch(`${API_URL}/api/v1/auth/login`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ email: creds.email, password: creds.password }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          id:           data.user.id,
          email:        data.user.email,
          name:         data.user.name,
          plan:         data.user.plan,
          accessToken:  data.access_token,
          refreshToken: data.refresh_token,
        };
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 7 * 24 * 3600 },
  secret:  process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      // Auto-refresh khi access token sắp hết hạn
      if (token.accessToken && token.accessTokenExpires) {
        const now = Date.now();
        const expires = token.accessTokenExpires as number;
        // Refresh sớm 1 phút trước khi hết hạn
        if (now > expires - 60 * 1000) {
          try {
            const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: token.refreshToken }),
            });
            if (res.ok) {
              const data = await res.json();
              token.accessToken = data.access_token;
              token.refreshToken = data.refresh_token ?? token.refreshToken;
              token.accessTokenExpires = Date.now() + 14 * 60 * 1000; // 14 phút
            }
          } catch {}
        }
      }
      if (user) {
        token.id           = user.id;
        token.plan         = (user as any).plan;
        token.accessToken  = (user as any).accessToken;
        token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
        token.refreshToken = (user as any).refreshToken;
      }
      // Google OAuth → gọi NestJS để upsert user + lấy JWT
      if (account?.provider === 'google' && account.access_token) {
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/google/id-token`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ id_token: account.id_token }),
          });
          if (res.ok) {
            const data = await res.json();
            token.id           = data.user.id;
            token.plan         = data.user.plan;
            token.accessToken  = data.access_token;
            token.accessTokenExpires = Date.now() + 14 * 60 * 1000;
            token.refreshToken = data.refresh_token;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id as string;
      (session as any).plan         = token.plan;
      (session as any).accessToken  = token.accessToken;
      (session as any).refreshToken = token.refreshToken;
      return session;
    },
  },

  pages: {
    signIn:  '/auth/login',
    error:   '/auth/login',
  },
});

export { handler as GET, handler as POST };
