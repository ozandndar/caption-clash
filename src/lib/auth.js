import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  events: {
    createUser: async ({ user }) => {
      // Create initial user stats
      await prisma.userStats.create({
        data: {
          userId: user.id,
          points: {
            create: {
              total: 0,
              daily: 0,
              weekly: 0
            }
          }
        }
      });
    },
  },
  },
}

export { authOptions }
export default authOptions 