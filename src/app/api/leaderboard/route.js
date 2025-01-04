import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const type = searchParams.get('type') || 'weekly'
    
    const timeFilter = type === 'daily' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : type === 'weekly'
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(0) // For 'overall', use the beginning of time

    const userStats = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        captions: type === 'overall' 
          ? {
              select: {
                _count: {
                  select: { likes: true }
                }
              }
            }
          : {
              where: {
                createdAt: { gte: timeFilter }
              },
              select: {
                _count: {
                  select: {
                    likes: {
                      where: {
                        createdAt: { gte: timeFilter }
                      }
                    }
                  }
                }
              }
            }
      },
      where: type === 'overall' 
        ? {}
        : {
            captions: {
              some: {
                createdAt: { gte: timeFilter }
              }
            }
          }
    })

    const leaderboard = userStats
      .map(user => {
        const periodLikes = user.captions.reduce((sum, caption) => 
          sum + caption._count.likes, 0)
        const captionsCount = user.captions.length

        // Points calculation based on period-specific data
        const points = (periodLikes * 10) + (captionsCount * 5)
        
        return {
          userId: user.id,
          name: user.name,
          image: user.image,
          points,
          likesReceived: periodLikes,
          captionsCount
        }
      })
      .filter(user => user.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10)

    return new Response(JSON.stringify(leaderboard), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 