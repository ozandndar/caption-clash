import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get a random screenshot
    const screenshots = await prisma.screenshot.findMany({
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

    return NextResponse.json(
      { error: "No screenshots available" },
      { status: 404 }
    )
  } catch (error) {
    console.error("Error fetching random screenshot:", error)
    return NextResponse.json(
      { error: "Failed to fetch random screenshot" },
      { status: 500 }
    )
  }
} 