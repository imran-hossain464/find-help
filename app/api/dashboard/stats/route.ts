import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HelpRequest, Event, Message, Notification } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [helpRequests, events, messages, notifications] = await Promise.all([
      HelpRequest.countDocuments({ status: "open" }),
      Event.countDocuments({ date: { $gte: new Date() } }),
      Message.countDocuments({ recipient: user._id, read: false }),
      Notification.countDocuments({ recipient: user._id, read: false }),
    ])

    return NextResponse.json({
      helpRequests,
      eventsCreated: events,
      messagesReceived: messages,
      notifications,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
