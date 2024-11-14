import NextAuth, { DefaultSession } from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
 
import { JWT } from "next-auth/jwt"
 

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      fullName: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    id?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,
    Credentials({
    credentials: {
      email: { label: "Email" },
      password: { label: "Password", type: "password" },
    },
    async authorize({ email, password }) {
      console.log(email)
      console.log(password)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Customer/login?email=${email}&password=${password}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response)
      if (!response.ok) return null
      return (await response.json()) ?? null
    },
  }),],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
        token.fullName = user.fullName
      }
      return token
    },
    session({ session, token }) {
      if (token.id){
        session.user.id = token.id
        session.user.fullName = token.fullName
      }
      
      return session
    },
  },
})