import { PrismaClient } from '@prisma/client'

const globalForPrisma = global

// Check if we already have a Prisma instance
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  })

  // Explicitly handle connection cleanup
  process.on('beforeExit', () => {
    globalForPrisma.prisma.$disconnect()
  })
}

export const prisma = globalForPrisma.prisma 