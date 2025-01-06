import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

const POINTS = {
  VIEW: 1,
  REACTION: 3,
  CAPTION: 10,
  LIKE: 30,
};

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { screenshotId } = await params
    const { type } = await request.json()

    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if user has any reaction on this screenshot
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        screenshotId,
        userId: session.user.id,
      },
    })

    if (existingReaction) {
      // If trying to add same reaction type, remove it
      if (existingReaction.type === type) {
        // Remove reaction if it exists
        await prisma.$transaction([
          prisma.reaction.delete({
            where: { id: existingReaction.id },
          }),
          prisma.user.update({
            where: { id: session.user.id },
            data: { points: { decrement: POINTS.REACTION } },
          }),
        ])

        return new Response(JSON.stringify({ 
          removed: true,
          message: 'Reaction removed successfully' 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        // If trying to add different reaction type, return error
        return new Response(JSON.stringify({ 
          error: 'You can only have one reaction per screenshot' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    // Add new reaction
    await prisma.$transaction([
      prisma.reaction.create({
        data: {
          type,
          screenshot: { connect: { id: screenshotId } },
          user: { connect: { id: session.user.id } },
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { points: { increment: POINTS.REACTION } },
      }),
    ])

    return new Response(JSON.stringify({ 
      added: true,
      message: 'Reaction added successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error handling reaction:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(request, { params }) {
  const { screenshotId } = await params;
  const session = await getServerSession(authOptions)

  try {
    const reactions = await prisma.reaction.groupBy({
      by: ['type'],
      where: { screenshotId },
      _count: {
        _all: true
      }
    });

    const formattedReactions = reactions.map(r => ({
      type: r.type,
      _count: r._count._all
    }));

    // If user is logged in, get their reactions for this screenshot
    let userReactions = [];
    if (session?.user) {
      userReactions = await prisma.reaction.findMany({
        where: {
          screenshotId,
          userId: session.user.id
        },
        select: {
          type: true
        }
      });
    }

    return new Response(JSON.stringify({
      reactions: formattedReactions,
      userReactions: userReactions.map(r => r.type)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 