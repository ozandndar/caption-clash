import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

export async function GET(request, { params }) {
  try {
    const { screenshotId } = await params
    const searchParams = new URL(request.url).searchParams
    const sortBy = searchParams.get('sortBy') || 'likes' // Changed default to 'likes'

    const captions = await prisma.caption.findMany({
      where: {
        screenshotId: screenshotId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        [sortBy === 'createdAt' ? 'createdAt' : 'likeCount']: 'desc', // Reversed the condition
      },
    })

    return new Response(JSON.stringify(captions), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error fetching captions:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request, { params }) {
  try {
    const { screenshotId } = await params
    console.log('Caption request for screenshot:', screenshotId)

    const { text, userId } = await request.json()
    console.log('Caption details:', { text, userId })

    // Verify the screenshot exists
    const screenshot = await prisma.screenshot.findUnique({
      where: { id: screenshotId }
    })

    console.log('Found screenshot:', screenshot)

    if (!screenshot) {
      // Try to find any screenshots to debug
      const allScreenshots = await prisma.screenshot.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
      console.log('Recent screenshots in DB:', allScreenshots)

      return new Response(JSON.stringify({
        error: "Screenshot not found",
        id: screenshotId
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create the caption
    const caption = await prisma.caption.create({
      data: {
        text,
        screenshot: {
          connect: { id: screenshotId }
        },
        author: {
          connect: { id: userId }
        }
      },
      include: {
        author: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    // Update screenshot caption count
    await prisma.screenshot.update({
      where: { id: screenshotId },
      data: {
        captionCount: {
          increment: 1
        }
      }
    })

    return new Response(JSON.stringify(caption), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      params
    })
    return new Response(JSON.stringify({ 
      error: "Failed to create caption" 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
} 