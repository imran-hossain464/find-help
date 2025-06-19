import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Conversation } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const conversations = await Conversation.find({
      participants: user._id,
    })
      .populate("participants", "firstName lastName")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName lastName",
        },
      })
      .sort({ updatedAt: -1 })

    return NextResponse.json(conversations)
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json({ message: "Participant ID is required" }, { status: 400 })
    }

    await connectDB()

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [user._id, participantId] },
    }).populate("participants", "firstName lastName")

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [user._id, participantId],
      })
      await conversation.populate("participants", "firstName lastName")
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error creating conversation:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
