import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // TODO: Replace with actual user lookup
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email }
        // })

        // if (!user || !user.password) {
        //   return null
        // }

        // const isPasswordValid = await compare(credentials.password, user.password)
        // if (!isPasswordValid) {
        //   return null
        // }

        // return {
        //   id: user.id,
        //   email: user.email,
        //   name: user.name
        // }

        // Mock user for demonstration
        return {
          id: "1",
          email: credentials.email,
          name: "John Doe"
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}