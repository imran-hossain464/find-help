import { connectDB } from "./mongodb"
import { Notification } from "./models"

export async function createNotification(
  recipientId: string,
  type: string,
  title: string,
  message: string,
  relatedId?: string,
) {
  try {
    await connectDB()

    await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      relatedId,
    })
  } catch (error) {
    console.error("Error creating notification:", error)
  }
}
