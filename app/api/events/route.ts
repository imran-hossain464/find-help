import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Event } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()

    const events = await Event.find().populate("organizer", "firstName lastName").sort({ date: 1 })

    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, description, date, time, location, category, maxAttendees } = await request.json()

    await connectDB()

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      maxAttendees,
      organizer: user._id,
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
