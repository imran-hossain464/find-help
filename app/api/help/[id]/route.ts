import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HelpRequest } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, description, category, urgency, location } = await request.json()

    await connectDB()

    const helpRequest = await HelpRequest.findById(id)
    if (!helpRequest) {
      return NextResponse.json({ message: "Help request not found" }, { status: 404 })
    }

    // Check if user is the author
    if (helpRequest.author.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "You can only edit your own help requests" }, { status: 403 })
    }

    const updatedHelpRequest = await HelpRequest.findByIdAndUpdate(
      id,
      { title, description, category, urgency, location },
      { new: true },
    ).populate("author", "firstName lastName")

    return NextResponse.json(updatedHelpRequest)
  } catch (error) {
    console.error("Error updating help request:", error)
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

    const helpRequest = await HelpRequest.findById(id)
    if (!helpRequest) {
      return NextResponse.json({ message: "Help request not found" }, { status: 404 })
    }

    // Check if user is the author
    if (helpRequest.author.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "You can only delete your own help requests" }, { status: 403 })
    }

    await HelpRequest.findByIdAndDelete(id)

    return NextResponse.json({ message: "Help request deleted successfully" })
  } catch (error) {
    console.error("Error deleting help request:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
