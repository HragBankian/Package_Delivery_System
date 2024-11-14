import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub,
    Credentials({
    credentials: {
      username: { label: "Username" },
      password: { label: "Password", type: "password" },
    },
    async authorize({ credentials }) {
      
      const response = await fetch(request)
      if (!response.ok) return null
      return (await response.json()) ?? null
    },
  }),],
})