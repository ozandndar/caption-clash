import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { captionId } = await params

    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if user has already liked this caption
    const existingLike = await prisma.like.findUnique({
      where: {
        captionId_userId: {
          captionId: captionId,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      // Unlike: Remove the like and decrement likeCount
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.caption.update({
          where: { id: captionId },
          data: { likeCount: { decrement: 1 } },
        }),
      ])

      return new Response(JSON.stringify({ 
        liked: false,
        message: 'Caption unliked successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Like: Create new like and increment likeCount
    await prisma.$transaction([
      prisma.like.create({
        data: {
          caption: { connect: { id: captionId } },
          user: { connect: { id: session.user.id } },
        },
      }),
      prisma.caption.update({
        where: { id: captionId },
        data: { likeCount: { increment: 1 } },
      }),
    ])

    return new Response(JSON.stringify({ 
      liked: true,
      message: 'Caption liked successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error handling like:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 