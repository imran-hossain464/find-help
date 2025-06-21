import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Message, Conversation } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"
import { createNotification } from "@/lib/notifications"

export async function GET(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { conversationId } = await params

    await connectDB()

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId)
    if (!conversation || !conversation.participants.includes(user._id)) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "firstName lastName")
      .sort({ createdAt: 1 })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content } = await request.json()
    const { conversationId } = await params

    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Message content is required" }, { status: 400 })
    }

    await connectDB()

    // Verify user is part of the conversation
    const conversation = await Conversation.findById(conversationId).populate("participants", "firstName lastName")
    if (!conversation || !conversation.participants.some((p: any) => p._id.toString() === user._id.toString())) {
      return NextResponse.json({ message: "Conversation not found" }, { status: 404 })
    }

    // Create message
    const message = await Message.create({
      content: content.trim(),
      sender: user._id,
      conversation: conversationId,
    })

    // Update conversation's last message and timestamp
    conversation.lastMessage = message._id
    conversation.updatedAt = new Date()
    await conversation.save()

    // Create notification for other participants
    const otherParticipants = conversation.participants.filter((p: any) => p._id.toString() !== user._id.toString())
    for (const participant of otherParticipants) {
      await createNotification(
        participant._id.toString(),
        "message",
        "New Message",
        `${user.firstName} ${user.lastName} sent you a message`,
        conversationId,
      )
    }

    // Populate sender info for response
    await message.populate("sender", "firstName lastName")

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
