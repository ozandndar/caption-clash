import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    const { screenshotId } = await params

    if (!session?.user) {
      return new Response(JSON.stringify({ hasSubmitted: false }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    // Check if user has already submitted a caption using the existing schema structure
    const existingCaption = await prisma.caption.findFirst({
      where: {
        AND: [
          { screenshotId: screenshotId },
          { author: { id: session.user.id } }
        ]
      }
    })

    return new Response(JSON.stringify({
      hasSubmitted: !!existingCaption,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })

  } catch (error) {
    console.error('Error checking caption:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      hasSubmitted: false 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
} 