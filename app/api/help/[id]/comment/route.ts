import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HelpRequest } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()
    const { id } = await params

    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 })
    }

    await connectDB()

    const helpRequest = await HelpRequest.findById(id)
    if (!helpRequest) {
      return NextResponse.json({ message: "Help request not found" }, { status: 404 })
    }

    const comment = {
      author: user._id,
      content: content.trim(),
      createdAt: new Date(),
    }

    helpRequest.comments.push(comment)
    await helpRequest.save()

    // Populate the comment author for response
    await helpRequest.populate("comments.author", "firstName lastName")

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await connectDB()

    const helpRequest = await HelpRequest.findById(id).populate("comments.author", "firstName lastName")

    if (!helpRequest) {
      return NextResponse.json({ message: "Help request not found" }, { status: 404 })
    }

    return NextResponse.json(helpRequest.comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
