import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HelpOffer } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const helpOffers = await HelpOffer.find().populate("author", "firstName lastName").sort({ createdAt: -1 })

    return NextResponse.json(helpOffers)
  } catch (error) {
    console.error("Error fetching help offers:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, availability, location } = await request.json()

    await connectDB()

    const helpOffer = await HelpOffer.create({
      title,
      description,
      category,
      availability,
      location,
      author: user._id,
    })

    return NextResponse.json(helpOffer, { status: 201 })
  } catch (error) {
    console.error("Error creating help offer:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
