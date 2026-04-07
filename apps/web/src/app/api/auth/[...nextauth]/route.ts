/**
 * NextAuth.js â SSO toÃ n há» sinh thÃ¡i Querencia
 * Providers: Google OAuth + Credentials (email/password)
 *
 * LÆ°u Ã½ Äáº·c biá»t:
 * Khi password = '__token__', nghÄ©a lÃ  client ÄÃ£ cÃ³ access_token tá»« API
 * (sau MFA hoáº·c Google callback), chá» cáº§n wrap vÃ o NextAuth session.
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
          // Fetch user info báº±ng token ÄÃ£ cÃ³
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

        // Case 2: Email + password thÆ°á»ng
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
      if (user) {
        token.id           = user.id;
        token.plan         = (user as any).plan;
        token.accessToken  = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      // Google OAuth â gá»i NestJS Äá» upsert user + láº¥y JWT
      if (account?.provider === 'google' && account.access_token) {
        try {
          const res = await fetch(`${API_URL}/api/v1/auth/google/token-exchange`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ google_access_token: account.access_token }),
          });
          if (res.ok) {
            const data = await res.json();
            token.id           = data.user.id;
            token.plan         = data.user.plan;
            token.accessToken  = data.access_token;
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
