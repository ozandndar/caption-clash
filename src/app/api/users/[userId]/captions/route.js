import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { userId } = await params
    const searchParams = new URL(request.url).searchParams
    const sortBy = searchParams.get('sortBy') || 'likes' // Default to likes

    if (!session?.user || session.user.id !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const captions = await prisma.caption.findMany({
      where: { authorId: userId },
      orderBy: {
        [sortBy === 'createdAt' ? 'createdAt' : 'likeCount']: 'desc',
      },
      include: {
        screenshot: {
          select: {
            url: true,
          },
        },
      },
    })

    return new Response(JSON.stringify(captions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error fetching user captions:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 