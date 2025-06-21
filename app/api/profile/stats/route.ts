import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { HelpRequest, HelpOffer, Event } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const [helpRequests, helpOffers, eventsCreated, eventsJoined] = await Promise.all([
      HelpRequest.countDocuments({ author: user._id }),
      HelpOffer.countDocuments({ author: user._id }),
      Event.countDocuments({ organizer: user._id }),
      Event.countDocuments({ attendees: user._id }),
    ])

    return NextResponse.json({
      helpRequests,
      helpOffers,
      eventsCreated,
      eventsJoined,
    })
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
