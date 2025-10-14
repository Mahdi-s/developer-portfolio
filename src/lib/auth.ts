import EmailProvider from "next-auth/providers/email"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    signIn: '/admin',
    verifyRequest: '/admin/verify',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Only allow specific email addresses for admin access
      const allowedEmails = process.env.ADMIN_EMAILS?.split(',') || []
      return allowedEmails.includes(user.email || '')
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      return token
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
