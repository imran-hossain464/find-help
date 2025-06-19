import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Event } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await connectDB()

    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user is already attending
    const isAlreadyAttending = event.attendees.includes(user._id)

    if (isAlreadyAttending) {
      // Remove user from attendees (leave event)
      event.attendees = event.attendees.filter((attendeeId: any) => attendeeId.toString() !== user._id.toString())
      await event.save()
      return NextResponse.json({ message: "Left event successfully", joined: false })
    } else {
      // Check if event is full
      if (event.attendees.length >= event.maxAttendees) {
        return NextResponse.json({ message: "Event is full" }, { status: 400 })
      }

      // Add user to attendees
      event.attendees.push(user._id)
      await event.save()
      return NextResponse.json({ message: "Joined event successfully", joined: true })
    }
  } catch (error) {
    console.error("Error joining/leaving event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
