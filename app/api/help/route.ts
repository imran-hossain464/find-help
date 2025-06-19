import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HelpRequest } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const helpRequests = await HelpRequest.find().populate("author", "firstName lastName").sort({ createdAt: -1 })

    return NextResponse.json(helpRequests)
  } catch (error) {
    console.error("Error fetching help requests:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, category, urgency, location } = await request.json()

    await connectDB()

    const helpRequest = await HelpRequest.create({
      title,
      description,
      category,
      urgency,
      location,
      author: user._id,
    })

    return NextResponse.json(helpRequest, { status: 201 })
  } catch (error) {
    console.error("Error creating help request:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
