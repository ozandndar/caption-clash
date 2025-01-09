import { prisma } from "@/lib/prisma"
import { calculatePoints } from "@/utils/points"

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams
    const type = searchParams.get('type') || 'weekly'
    
    const timeFilter = type === 'daily' 
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : type === 'weekly'
      ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      : new Date(0) // For 'overall', use the beginning of time

    const users = await prisma.user.findMany({
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
            },
        viewHistory: {
          ...(type !== 'overall' && {
            where: {
              viewedAt: { gte: timeFilter }
            }
          }),
          select: { id: true }
        },
        reactions: {
          ...(type !== 'overall' && {
            where: {
              createdAt: { gte: timeFilter }
            }
          }),
          select: { id: true }
        },
      },
      where: type === 'overall' 
        ? {}
        : {
            OR: [
              { captions: { some: { createdAt: { gte: timeFilter } } } },
              { viewHistory: { some: { viewedAt: { gte: timeFilter } } } },
              { reactions: { some: { createdAt: { gte: timeFilter } } } }
            ]
          }
    });

    const leaderboard = users.map(user => {
      const periodLikes = user.captions.reduce((sum, caption) => 
        sum + caption._count.likes, 0)
      const captionsCount = user.captions.length
      const viewsCount = user.viewHistory?.length || 0
      const reactionsCount = user.reactions?.length || 0

      const points = calculatePoints({
        likes: periodLikes,
        captions: captionsCount,
        views: viewsCount,
        reactions: reactionsCount,
      })

      return {
        userId: user.id,
        name: user.name,
        image: user.image,
        points,
        likesReceived: periodLikes,
        captionsCount,
        totalViews: viewsCount,
        totalReactions: reactionsCount,
      }
    })
    .sort((a, b) => b.points - a.points)

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