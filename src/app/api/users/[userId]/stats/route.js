import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { userId } = params

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
      totalLikesReceived: totalLikesReceived._sum.likeCount || 0,
      dailyLikes,
      weeklyLikes,
      points: {
        total: (totalLikesReceived._sum.likeCount || 0) * 10 + totalCaptions * 5,
        daily: dailyLikes * 10,
        weekly: weeklyLikes * 10
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