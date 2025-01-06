import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import { calculatePoints } from "@/utils/points"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { userId } = await params

    if (!session?.user || session.user.id !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get total captions
    const totalCaptions = await prisma.caption.count({
      where: { authorId: userId },
    })

    // Get total views (screenshots seen)
    const totalViews = await prisma.viewHistory.count({
      where: { userId },
    })

    // Get total reactions left by user
    const totalReactions = await prisma.reaction.count({
      where: { userId },
    })

    // Get total likes received
    const totalLikesReceived = await prisma.caption.aggregate({
      where: { authorId: userId },
      _sum: {
        likeCount: true,
      },
    })

    // Get likes received in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const dailyLikes = await prisma.like.count({
      where: {
        caption: { authorId: userId },
        createdAt: { gte: oneDayAgo }
      },
    })

    // Get likes received in last 7 days
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weeklyLikes = await prisma.like.count({
      where: {
        caption: { authorId: userId },
        createdAt: { gte: oneWeekAgo }
      },
    })

    return new Response(JSON.stringify({
      totalCaptions,
      totalViews,
      totalReactions,
      totalLikesReceived: totalLikesReceived._sum.likeCount || 0,
      points: {
        total: calculatePoints({
          likes: totalLikesReceived._sum.likeCount || 0,
          captions: totalCaptions,
          views: totalViews,
          reactions: totalReactions,
        })
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error fetching user stats:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 