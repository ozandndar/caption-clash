import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    console.log('Received request body:', body)

    const { url, id } = body
    
    if (!url || !id) {
      console.error('Missing required fields:', { url, id })
      return NextResponse.json(
        { error: "URL and ID are required" },
        { status: 400 }
      )
    }

    try {
      // Use upsert to either create or update
      const screenshot = await prisma.screenshot.upsert({
        where: {
          id: id
        },
        update: {
          url: url,
          status: 'PENDING',
          lastShownAt: new Date()
        },
        create: {
          id: id,
          url: url,
          status: 'PENDING',
          lastShownAt: new Date()
        }
      })

      console.log('Screenshot upserted:', screenshot)
      return NextResponse.json({ success: true, screenshot })
    } catch (dbError) {
      console.error('Database operation failed:', dbError)
      return NextResponse.json(
        { error: "Database operation failed", details: dbError.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error handling screenshot:", error)
    return NextResponse.json(
      { 
        error: "Failed to handle screenshot", 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const random = searchParams.get('random') === 'true'

    if (random) {
      // Get a random screenshot
      const screenshots = await prisma.screenshot.findMany({
        where: {
          status: 'PENDING' // Include all screenshots for now
        },
        take: 1,
        orderBy: {
          lastShownAt: 'asc'
        }
      })

      if (screenshots.length > 0) {
        // Update lastShownAt
        const updated = await prisma.screenshot.update({
          where: { id: screenshots[0].id },
          data: { lastShownAt: new Date() }
        })
        return NextResponse.json({ screenshot: updated })
      }

      return NextResponse.json({ screenshot: null })
    }

    // Normal list query
    const screenshots = await prisma.screenshot.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ screenshots })
  } catch (error) {
    console.error("Error fetching screenshots:", error)
    return NextResponse.json(
      { error: "Failed to fetch screenshots", details: error.message },
      { status: 500 }
    )
  }
} 