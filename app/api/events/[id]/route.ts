import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Event } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, description, date, time, location, category, maxAttendees } = await request.json()

    await connectDB()

    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 })
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "You can only edit your own events" }, { status: 403 })
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, description, date, time, location, category, maxAttendees },
      { new: true },
    ).populate("organizer", "firstName lastName")

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error("Error updating event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Check if user is the organizer
    if (event.organizer.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "You can only delete your own events" }, { status: 403 })
    }

    await Event.findByIdAndDelete(id)

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Error deleting event:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
