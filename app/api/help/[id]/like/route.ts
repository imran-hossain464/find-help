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

    const { id } = await params

    await connectDB()

    const helpRequest = await HelpRequest.findById(id)
    if (!helpRequest) {
      return NextResponse.json({ message: "Help request not found" }, { status: 404 })
    }

    const userLiked = helpRequest.likes.includes(user._id)

    if (userLiked) {
      // Unlike
      helpRequest.likes = helpRequest.likes.filter((id: any) => id.toString() !== user._id.toString())
    } else {
      // Like
      helpRequest.likes.push(user._id)
    }

    await helpRequest.save()

    return NextResponse.json({ liked: !userLiked, likesCount: helpRequest.likes.length })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
