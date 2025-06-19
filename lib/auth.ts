import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "./mongodb"
import { User } from "./models"

export async function getAuthUser(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { userId: string }

    await connectDB()

    const user = await User.findById(decoded.userId).select("-password")
    return user
  } catch (error) {
    return null
  }
}
