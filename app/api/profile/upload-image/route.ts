import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"
import { getAuthUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request)
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ message: "No image provided" }, { status: 400 })
    }

    // Convert image to base64 for storage (in a real app, you'd use a cloud storage service)
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`

    await connectDB()

    const updatedUser = await User.findByIdAndUpdate(user._id, { profileImage: base64Image }, { new: true }).select(
      "-password",
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ imageUrl: base64Image })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
